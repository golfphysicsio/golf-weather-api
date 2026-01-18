import { useState, useEffect } from 'react'

export default function SystemHealth({ token, apiBase }) {
  const [stats, setStats] = useState(null)
  const [errorRate, setErrorRate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cleanupResult, setCleanupResult] = useState(null)
  const [aggregateResult, setAggregateResult] = useState(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [token])

  const fetchData = async () => {
    try {
      const [statsRes, errorRateRes] = await Promise.all([
        fetch(`${apiBase}/admin-api/system/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiBase}/admin-api/system/error-rate?hours=1`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (statsRes.ok) setStats(await statsRes.json())
      if (errorRateRes.ok) setErrorRate(await errorRateRes.json())
      setError(null)
    } catch (err) {
      setError('Failed to load system stats')
    } finally {
      setLoading(false)
    }
  }

  const runCleanup = async () => {
    try {
      const res = await fetch(`${apiBase}/admin-api/system/cleanup`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const result = await res.json()
        setCleanupResult(result)
        setTimeout(() => setCleanupResult(null), 5000)
        fetchData()
      }
    } catch (err) {
      setError('Cleanup failed')
    }
  }

  const runAggregation = async () => {
    try {
      const res = await fetch(`${apiBase}/admin-api/system/aggregate-usage`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const result = await res.json()
        setAggregateResult(result)
        setTimeout(() => setAggregateResult(null), 5000)
      }
    } catch (err) {
      setError('Aggregation failed')
    }
  }

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  if (loading) {
    return <div className="text-center py-8">Loading system health...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">System Health</h2>
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Alert Banner */}
      {stats?.alerts?.high_error_rate && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <span className="text-2xl mr-3">Warning</span>
            <div>
              <p className="font-bold text-red-800">High Error Rate Detected</p>
              <p className="text-red-700">
                Error rate is {stats.requests.error_rate_1h_percent}% (threshold: {stats.alerts.error_rate_threshold}%)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* API Health */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">API Status</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Healthy
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">Online</p>
          <p className="text-sm text-gray-500">
            Avg latency: {stats?.requests?.avg_latency_ms_24h?.toFixed(0) || 0}ms
          </p>
        </div>

        {/* Requests (24h) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Requests (24h)</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats?.requests?.last_24h?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-500">
            Errors: {stats?.requests?.errors_24h || 0}
          </p>
        </div>

        {/* Error Rate */}
        <div className={`bg-white rounded-lg shadow p-6 ${
          stats?.requests?.error_rate_1h_percent > 5 ? 'border-2 border-red-500' : ''
        }`}>
          <h3 className="text-sm font-medium text-gray-500">Error Rate (1h)</h3>
          <p className={`mt-2 text-3xl font-bold ${
            stats?.requests?.error_rate_1h_percent > 5 ? 'text-red-600' : 'text-gray-900'
          }`}>
            {stats?.requests?.error_rate_1h_percent || 0}%
          </p>
          <p className="text-sm text-gray-500">
            {stats?.requests?.errors_1h || 0} / {stats?.requests?.last_1h || 0} requests
          </p>
        </div>

        {/* Active API Keys */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active API Keys</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats?.api_keys?.active || 0}
          </p>
          <p className="text-sm text-gray-500">
            Total: {stats?.api_keys?.total || 0}
          </p>
        </div>
      </div>

      {/* Database Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Database</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Total Size</p>
            <p className="text-xl font-bold">{stats?.database?.size_mb || 0} MB</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Requests (All Time)</p>
            <p className="text-xl font-bold">
              {stats?.api_keys?.total_requests_all_time?.toLocaleString() || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-xl font-bold">
              {stats?.timestamp ? new Date(stats.timestamp).toLocaleTimeString() : '-'}
            </p>
          </div>
        </div>

        {/* Table Sizes */}
        <h4 className="text-sm font-medium text-gray-700 mb-2">Table Sizes</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Table</th>
                <th className="px-4 py-2 text-right">Rows</th>
                <th className="px-4 py-2 text-right">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats?.database?.tables?.map(table => (
                <tr key={table.name}>
                  <td className="px-4 py-2 font-mono">{table.name}</td>
                  <td className="px-4 py-2 text-right">{table.rows?.toLocaleString() || 0}</td>
                  <td className="px-4 py-2 text-right">{formatBytes(table.size_bytes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Errors */}
      {errorRate?.recent_errors?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Errors (Last Hour)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">Endpoint</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {errorRate.recent_errors.slice(0, 10).map((err, i) => (
                  <tr key={i} className="bg-red-50">
                    <td className="px-4 py-2">
                      {err.timestamp ? new Date(err.timestamp).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-4 py-2 font-mono">{err.endpoint}</td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        {err.status_code}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-red-600">{err.message || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Maintenance Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Maintenance Actions</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <button
              onClick={runCleanup}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Cleanup Old Logs
            </button>
            {cleanupResult && (
              <span className="ml-2 text-green-600">
                Deleted {cleanupResult.deleted_rows} rows
              </span>
            )}
          </div>
          <div>
            <button
              onClick={runAggregation}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Aggregate Daily Usage
            </button>
            {aggregateResult && (
              <span className="ml-2 text-green-600">
                Aggregated for {aggregateResult.aggregated_date}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Log cleanup removes entries older than 48 hours. Usage aggregation compiles daily statistics.
        </p>
      </div>

      {/* Monitoring Setup Info */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">External Monitoring</h3>
        <p className="text-blue-800 mb-4">
          Set up UptimeRobot or similar service to monitor these endpoints:
        </p>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li><code className="bg-blue-100 px-1 rounded">{apiBase}/api/v1/health</code> - API Health</li>
          <li><code className="bg-blue-100 px-1 rounded">{apiBase}/admin</code> - Admin Dashboard</li>
        </ul>
        <p className="text-sm text-blue-600 mt-2">
          See the Operational Runbook for detailed setup instructions.
        </p>
      </div>
    </div>
  )
}
