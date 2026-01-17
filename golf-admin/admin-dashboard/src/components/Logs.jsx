import { useState, useEffect } from 'react'

export default function Logs({ token, apiBase }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    client_name: '',
    status_code: '',
    endpoint: '',
    limit: 100
  })
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchLogs()
    let interval
    if (autoRefresh) {
      interval = setInterval(fetchLogs, 10000) // Refresh every 10s
    }
    return () => clearInterval(interval)
  }, [token, filters, autoRefresh])

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams()
      params.append('limit', filters.limit)
      if (filters.client_name) params.append('client_name', filters.client_name)
      if (filters.status_code) params.append('status_code', filters.status_code)
      if (filters.endpoint) params.append('endpoint', filters.endpoint)

      const response = await fetch(`${apiBase}/admin-api/logs?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setLogs(await response.json())
        setError(null)
      } else {
        setError('Failed to load logs')
      }
    } catch (err) {
      setError('Failed to load logs')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800'
    if (status >= 300 && status < 400) return 'bg-blue-100 text-blue-800'
    if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getLatencyColor = (latency) => {
    if (latency < 100) return 'text-green-600'
    if (latency < 500) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Get unique clients and endpoints for filters
  const uniqueClients = [...new Set(logs.map(l => l.client_name).filter(Boolean))]
  const uniqueEndpoints = [...new Set(logs.map(l => l.endpoint))]

  if (loading && logs.length === 0) {
    return <div className="text-center py-8">Loading logs...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Request Logs</h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">Auto-refresh (10s)</span>
          </label>
          <button
            onClick={fetchLogs}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
          <select
            value={filters.client_name}
            onChange={(e) => setFilters({ ...filters, client_name: e.target.value })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Clients</option>
            {uniqueClients.map(client => (
              <option key={client} value={client}>{client}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status Code</label>
          <select
            value={filters.status_code}
            onChange={(e) => setFilters({ ...filters, status_code: e.target.value })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All</option>
            <option value="200">200 OK</option>
            <option value="400">400 Bad Request</option>
            <option value="401">401 Unauthorized</option>
            <option value="403">403 Forbidden</option>
            <option value="404">404 Not Found</option>
            <option value="429">429 Rate Limited</option>
            <option value="500">500 Server Error</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint</label>
          <input
            type="text"
            value={filters.endpoint}
            onChange={(e) => setFilters({ ...filters, endpoint: e.target.value })}
            className="border rounded-lg px-3 py-2"
            placeholder="Filter by endpoint..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Limit</label>
          <select
            value={filters.limit}
            onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value) })}
            className="border rounded-lg px-3 py-2"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
            <option value={500}>500</option>
          </select>
        </div>
        <button
          onClick={() => setFilters({ client_name: '', status_code: '', endpoint: '', limit: 100 })}
          className="text-blue-600 hover:text-blue-800"
        >
          Clear Filters
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Client</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Method</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Endpoint</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Latency</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">IP</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map(log => (
                <tr key={log.id} className={log.status_code >= 400 ? 'bg-red-50' : ''}>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {log.client_name || <span className="text-gray-400">Unknown</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.method === 'GET' ? 'bg-green-100 text-green-800' :
                      log.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      log.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                      log.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {log.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm">{log.endpoint}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(log.status_code)}`}>
                      {log.status_code}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm ${getLatencyColor(log.latency_ms)}`}>
                    {log.latency_ms}ms
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                    {log.request_ip || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600">
                    {log.error_message || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <p className="text-gray-500 text-center py-8">No logs found</p>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500 text-center">
        Showing {logs.length} logs from the last 48 hours
      </p>
    </div>
  )
}
