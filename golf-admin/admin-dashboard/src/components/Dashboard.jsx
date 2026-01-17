import { useState, useEffect } from 'react'

export default function Dashboard({ token, apiBase }) {
  const [summary, setSummary] = useState(null)
  const [apiKeys, setApiKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [token])

  const fetchData = async () => {
    try {
      const [summaryRes, keysRes] = await Promise.all([
        fetch(`${apiBase}/admin-api/usage/summary`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiBase}/admin-api/api-keys`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (summaryRes.ok) {
        setSummary(await summaryRes.json())
      }
      if (keysRes.ok) {
        setApiKeys(await keysRes.json())
      }
      setError(null)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>
  }

  const activeKeys = apiKeys.filter(k => k.status === 'active').length
  const totalKeys = apiKeys.length

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Requests (24h)"
          value={summary?.total_requests_24h || 0}
          icon="📨"
          color="blue"
        />
        <StatCard
          title="Errors (24h)"
          value={summary?.total_errors_24h || 0}
          icon="❌"
          color="red"
        />
        <StatCard
          title="Avg Latency"
          value={`${summary?.avg_latency_24h?.toFixed(1) || 0}ms`}
          icon="⚡"
          color="yellow"
        />
        <StatCard
          title="Active Clients"
          value={summary?.active_clients || 0}
          icon="👥"
          color="green"
        />
      </div>

      {/* API Keys Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">API Keys</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Keys</span>
              <span className="font-semibold">{totalKeys}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active</span>
              <span className="font-semibold text-green-600">{activeKeys}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Disabled/Revoked</span>
              <span className="font-semibold text-gray-500">{totalKeys - activeKeys}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Requests by Tier</h3>
          <div className="space-y-3">
            {Object.entries(summary?.requests_by_tier || {}).map(([tier, count]) => (
              <div key={tier} className="flex justify-between">
                <span className="text-gray-600 capitalize">{tier}</span>
                <span className="font-semibold">{count.toLocaleString()}</span>
              </div>
            ))}
            {Object.keys(summary?.requests_by_tier || {}).length === 0 && (
              <p className="text-gray-500">No requests in the last 24 hours</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent API Keys */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent API Keys</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-sm font-medium text-gray-500">Client</th>
                <th className="text-left py-2 text-sm font-medium text-gray-500">Tier</th>
                <th className="text-left py-2 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-2 text-sm font-medium text-gray-500">Requests Today</th>
                <th className="text-left py-2 text-sm font-medium text-gray-500">Last Used</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.slice(0, 5).map(key => (
                <tr key={key.id} className="border-b">
                  <td className="py-2">{key.client_name}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      key.tier === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                      key.tier === 'standard' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {key.tier}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      key.status === 'active' ? 'bg-green-100 text-green-800' :
                      key.status === 'disabled' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {key.status}
                    </span>
                  </td>
                  <td className="py-2">{key.requests_today?.toLocaleString() || 0}</td>
                  <td className="py-2 text-sm text-gray-500">
                    {key.last_used_at ? new Date(key.last_used_at).toLocaleString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {apiKeys.length === 0 && (
            <p className="text-gray-500 text-center py-4">No API keys created yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
