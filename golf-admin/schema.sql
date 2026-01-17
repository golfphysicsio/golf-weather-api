-- Golf Physics Admin Dashboard - Database Schema
-- Run this against your Railway PostgreSQL database

-- ============================================
-- API KEYS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_api_keys (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(64) NOT NULL UNIQUE,  -- SHA-256 hash of the API key
    key_prefix VARCHAR(20) NOT NULL,        -- First 8 chars for identification (e.g., "golf_abc")
    tier VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'standard', 'enterprise')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'revoked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE,
    requests_today INTEGER DEFAULT 0,
    total_requests BIGINT DEFAULT 0,
    notes TEXT
);

-- Index for fast key lookup during authentication
CREATE INDEX IF NOT EXISTS idx_admin_api_keys_hash ON admin_api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_admin_api_keys_status ON admin_api_keys(status);
CREATE INDEX IF NOT EXISTS idx_admin_api_keys_client ON admin_api_keys(client_name);

-- ============================================
-- REQUEST LOGS TABLE (48-hour retention)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_request_logs (
    id SERIAL PRIMARY KEY,
    api_key_id INTEGER REFERENCES admin_api_keys(id) ON DELETE SET NULL,
    client_name VARCHAR(255),              -- Denormalized for faster queries
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    latency_ms REAL NOT NULL,
    error_message TEXT,
    request_ip VARCHAR(45),                -- IPv4 or IPv6
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_admin_request_logs_created ON admin_request_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_request_logs_api_key ON admin_request_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_admin_request_logs_client ON admin_request_logs(client_name);
CREATE INDEX IF NOT EXISTS idx_admin_request_logs_status ON admin_request_logs(status_code);
CREATE INDEX IF NOT EXISTS idx_admin_request_logs_endpoint ON admin_request_logs(endpoint);

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_admin_request_logs_client_date
ON admin_request_logs(client_name, created_at DESC);

-- ============================================
-- DAILY USAGE AGGREGATION TABLE (for faster analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_daily_usage (
    id SERIAL PRIMARY KEY,
    api_key_id INTEGER REFERENCES admin_api_keys(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    total_requests INTEGER DEFAULT 0,
    successful_requests INTEGER DEFAULT 0,
    error_requests INTEGER DEFAULT 0,
    avg_latency_ms REAL DEFAULT 0,
    UNIQUE(api_key_id, date)
);

CREATE INDEX IF NOT EXISTS idx_admin_daily_usage_date ON admin_daily_usage(date DESC);
CREATE INDEX IF NOT EXISTS idx_admin_daily_usage_client ON admin_daily_usage(client_name);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to clean up old request logs (keeps last 48 hours)
CREATE OR REPLACE FUNCTION cleanup_old_request_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM admin_request_logs
    WHERE created_at < NOW() - INTERVAL '48 hours';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to aggregate daily usage from request logs
CREATE OR REPLACE FUNCTION aggregate_daily_usage(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
BEGIN
    INSERT INTO admin_daily_usage (api_key_id, client_name, date, total_requests, successful_requests, error_requests, avg_latency_ms)
    SELECT
        api_key_id,
        client_name,
        target_date,
        COUNT(*) as total_requests,
        COUNT(*) FILTER (WHERE status_code >= 200 AND status_code < 400) as successful_requests,
        COUNT(*) FILTER (WHERE status_code >= 400) as error_requests,
        AVG(latency_ms) as avg_latency_ms
    FROM admin_request_logs
    WHERE DATE(created_at) = target_date
    AND api_key_id IS NOT NULL
    GROUP BY api_key_id, client_name
    ON CONFLICT (api_key_id, date)
    DO UPDATE SET
        total_requests = EXCLUDED.total_requests,
        successful_requests = EXCLUDED.successful_requests,
        error_requests = EXCLUDED.error_requests,
        avg_latency_ms = EXCLUDED.avg_latency_ms;
END;
$$ LANGUAGE plpgsql;

-- Function to reset daily request counters (run at midnight)
CREATE OR REPLACE FUNCTION reset_daily_counters()
RETURNS VOID AS $$
BEGIN
    UPDATE admin_api_keys SET requests_today = 0;
END;
$$ LANGUAGE plpgsql;

-- Function to update last_used timestamp and increment counters
CREATE OR REPLACE FUNCTION update_api_key_usage(key_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE admin_api_keys
    SET
        last_used_at = NOW(),
        requests_today = requests_today + 1,
        total_requests = total_requests + 1
    WHERE id = key_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS FOR EASY QUERYING
-- ============================================

-- View: Active API keys with usage stats
CREATE OR REPLACE VIEW admin_api_keys_overview AS
SELECT
    ak.id,
    ak.client_name,
    ak.key_prefix,
    ak.tier,
    ak.status,
    ak.created_at,
    ak.last_used_at,
    ak.requests_today,
    ak.total_requests,
    ak.notes,
    CASE ak.tier
        WHEN 'free' THEN 60
        WHEN 'standard' THEN 1000
        WHEN 'enterprise' THEN 20000
        ELSE 60
    END as rate_limit_per_minute
FROM admin_api_keys ak;

-- View: Recent request logs with client info
CREATE OR REPLACE VIEW admin_recent_logs AS
SELECT
    rl.id,
    rl.client_name,
    rl.endpoint,
    rl.method,
    rl.status_code,
    rl.latency_ms,
    rl.error_message,
    rl.request_ip,
    rl.created_at
FROM admin_request_logs rl
WHERE rl.created_at > NOW() - INTERVAL '48 hours'
ORDER BY rl.created_at DESC;

-- View: Usage summary by client (last 30 days)
CREATE OR REPLACE VIEW admin_usage_summary AS
SELECT
    client_name,
    SUM(total_requests) as total_requests,
    SUM(successful_requests) as successful_requests,
    SUM(error_requests) as error_requests,
    ROUND(AVG(avg_latency_ms)::numeric, 2) as avg_latency_ms,
    ROUND((SUM(error_requests)::numeric / NULLIF(SUM(total_requests), 0) * 100)::numeric, 2) as error_rate_percent
FROM admin_daily_usage
WHERE date > CURRENT_DATE - INTERVAL '30 days'
GROUP BY client_name
ORDER BY total_requests DESC;

-- ============================================
-- RATE LIMIT TIERS REFERENCE
-- ============================================
-- free: 60 requests/minute
-- standard: 1,000 requests/minute
-- enterprise: 20,000 requests/minute

COMMENT ON TABLE admin_api_keys IS 'API keys for Golf Physics API clients';
COMMENT ON TABLE admin_request_logs IS 'Request logs with 48-hour retention';
COMMENT ON TABLE admin_daily_usage IS 'Aggregated daily usage statistics';
