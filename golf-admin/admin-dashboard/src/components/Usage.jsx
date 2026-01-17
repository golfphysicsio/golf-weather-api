import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Usage({ token, apiBase }) {
  const [usage, setUsage] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [days, setDays] = useState(30)
  const [clientFilter, setClientFilter] = useState('')
  const [clients, setClients] = useState([])
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchUsage()
  }, [token, days, clientFilter])

  const fetchUsage = async () => {
    setLoading(true)
    try {
      let url = `${apiBase}/admin-api/usage/daily?days=${days}`
      if (clientFilter) {
        url += `&client_name=${encodeURIComponent(clientFilter)}`
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setUsage(data)

        // Extract unique clients
        const uniqueClients = [...new Set(data.map(d => d.client_name))]
        setClients(uniqueClients)
      } else {
        setError('Failed to load usage data')
      }
    } catch (err) {
      setError('Failed to load usage data')
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = async () => {
    setExporting(true)
    try {
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      const response = await fetch(
        `${apiBase}/admin-api/usage/export?start_date=${startDate}&end_date=${endDate}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `usage_${startDate}_to_${endDate}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        setError('Failed to export CSV')
      }
    } catch (err) {
      setError('Failed to export CSV')
    } finally {
      setExporting(false)
    }
  }

  // Aggregate data by date for charts
  const aggregatedByDate = usage.reduce((acc, item) => {
    const existing = acc.find(d => d.date === item.date)
    if (existing) {
      existing.total_requests += item.total_requests
      existing.error_requests += item.error_requests
      existing.successful_requests += item.successful_requests
    } else {
      acc.push({
        date: item.date,
        total_requests: item.total_requests,
        error_requests: item.error_requests,
        successful_requests: item.successful_requests
      })
    }
    return acc
  }, []).sort((a, b) => a.date.localeCompare(b.date))

  // Aggregate by client for comparison
  const aggregatedByClient = usage.reduce((acc, item) => {
    const existing = acc.find(d => d.client_name === item.client_name)
    if (existing) {
      existing.total_requests += item.total_requests
      existing.error_requests += item.error_requests
    } else {
      acc.push({
        client_name: item.client_name,
        total_requests: item.total_requests,
        error_requests: item.error_requests
      })
    }
    return acc
  }, []).sort((a, b) => b.total_requests - a.total_requests)

  if (loading && usage.length === 0) {
    return <div className="text-center py-8">Loading usage data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Usage Analytics</h2>
        <button
          onClick={exportCSV}
          disabled={exporting}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border rounded-lg px-3 py-2"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Clients</option>
            {clients.map(client => (
              <option key={client} value={client}>{client}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Requests Over Time</h3>
          {aggregatedByDate.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={aggregatedByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Legend />
                <Line type="monotone" dataKey="total_requests" stroke="#3B82F6" name="Total" />
                <Line type="monotone" dataKey="successful_requests" stroke="#10B981" name="Successful" />
                <Line type="monotone" dataKey="error_requests" stroke="#EF4444" name="Errors" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        {/* Requests by Client */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Requests by Client</h3>
          {aggregatedByClient.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aggregatedByClient.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="client_name" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_requests" fill="#3B82F6" name="Requests" />
                <Bar dataKey="error_requests" fill="#EF4444" name="Errors" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b">Detailed Usage</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Client</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Requests</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Successful</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Errors</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Error Rate</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Avg Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {usage.slice(0, 50).map((row, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">{row.client_name}</td>
                  <td className="px-4 py-3">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">{row.total_requests.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-green-600">{row.successful_requests.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-red-600">{row.error_requests.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={row.error_rate_percent > 5 ? 'text-red-600 font-medium' : ''}>
                      {row.error_rate_percent}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{row.avg_latency_ms}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
          {usage.length === 0 && (
            <p className="text-gray-500 text-center py-8">No usage data available</p>
          )}
        </div>
      </div>
    </div>
  )
}
