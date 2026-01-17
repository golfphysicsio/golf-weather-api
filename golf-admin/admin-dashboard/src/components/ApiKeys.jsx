import { useState, useEffect } from 'react'

export default function ApiKeys({ token, apiBase }) {
  const [apiKeys, setApiKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newKey, setNewKey] = useState(null)
  const [createForm, setCreateForm] = useState({ client_name: '', tier: 'free', notes: '' })
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchApiKeys()
  }, [token])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch(`${apiBase}/admin-api/api-keys`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        setApiKeys(await response.json())
      } else {
        setError('Failed to load API keys')
      }
    } catch (err) {
      setError('Failed to load API keys')
    } finally {
      setLoading(false)
    }
  }

  const createApiKey = async (e) => {
    e.preventDefault()
    setCreating(true)
    setError(null)

    try {
      const response = await fetch(`${apiBase}/admin-api/api-keys`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createForm)
      })

      if (response.ok) {
        const data = await response.json()
        setNewKey(data.api_key)
        setShowCreate(false)
        setCreateForm({ client_name: '', tier: 'free', notes: '' })
        fetchApiKeys()
      } else {
        const err = await response.json()
        setError(err.detail || 'Failed to create API key')
      }
    } catch (err) {
      setError('Failed to create API key')
    } finally {
      setCreating(false)
    }
  }

  const updateStatus = async (keyId, status) => {
    try {
      const response = await fetch(`${apiBase}/admin-api/api-keys/${keyId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchApiKeys()
      } else {
        setError('Failed to update status')
      }
    } catch (err) {
      setError('Failed to update status')
    }
  }

  const updateTier = async (keyId, tier) => {
    try {
      const response = await fetch(`${apiBase}/admin-api/api-keys/${keyId}/tier`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tier })
      })

      if (response.ok) {
        fetchApiKeys()
      } else {
        setError('Failed to update tier')
      }
    } catch (err) {
      setError('Failed to update tier')
    }
  }

  const revokeKey = async (keyId) => {
    if (!confirm('Are you sure you want to revoke this API key? This cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`${apiBase}/admin-api/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchApiKeys()
      } else {
        setError('Failed to revoke key')
      }
    } catch (err) {
      setError('Failed to revoke key')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading API keys...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">API Keys</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Create New Key
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button onClick={() => setError(null)} className="float-right">&times;</button>
        </div>
      )}

      {/* New Key Display */}
      {newKey && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">New API Key Created!</h3>
          <p className="text-sm text-green-700 mb-2">Copy this key now - it will not be shown again:</p>
          <div className="flex gap-2">
            <code className="flex-1 bg-white p-3 rounded border font-mono text-sm break-all">
              {newKey}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(newKey)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 min-w-[80px]"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <button
            onClick={() => setNewKey(null)}
            className="mt-2 text-sm text-green-600 hover:text-green-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Create Form Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New API Key</h3>
            <form onSubmit={createApiKey} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.client_name}
                  onChange={(e) => setCreateForm({ ...createForm, client_name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., Acme Golf Club"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tier
                </label>
                <select
                  value={createForm.tier}
                  onChange={(e) => setCreateForm({ ...createForm, tier: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="free">Free (60 req/min)</option>
                  <option value="standard">Standard (1,000 req/min)</option>
                  <option value="enterprise">Enterprise (20,000 req/min)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows="2"
                  placeholder="Optional notes about this client"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* API Keys Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Client</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Key Prefix</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tier</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Requests</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Last Used</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {apiKeys.map(key => (
              <tr key={key.id} className={key.status === 'revoked' ? 'bg-gray-50' : ''}>
                <td className="px-4 py-3">
                  <div className="font-medium">{key.client_name}</div>
                  {key.notes && <div className="text-xs text-gray-500">{key.notes}</div>}
                </td>
                <td className="px-4 py-3 font-mono text-sm">{key.key_prefix}...</td>
                <td className="px-4 py-3">
                  {key.status !== 'revoked' ? (
                    <select
                      value={key.tier}
                      onChange={(e) => updateTier(key.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="free">Free</option>
                      <option value="standard">Standard</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  ) : (
                    <span className="text-gray-500">{key.tier}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    key.status === 'active' ? 'bg-green-100 text-green-800' :
                    key.status === 'disabled' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {key.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div>{key.requests_today?.toLocaleString() || 0} today</div>
                  <div className="text-xs text-gray-500">{key.total_requests?.toLocaleString() || 0} total</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {key.last_used_at ? new Date(key.last_used_at).toLocaleString() : 'Never'}
                </td>
                <td className="px-4 py-3">
                  {key.status !== 'revoked' && (
                    <div className="flex gap-2">
                      {key.status === 'active' ? (
                        <button
                          onClick={() => updateStatus(key.id, 'disabled')}
                          className="text-yellow-600 hover:text-yellow-800 text-sm"
                        >
                          Disable
                        </button>
                      ) : (
                        <button
                          onClick={() => updateStatus(key.id, 'active')}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Enable
                        </button>
                      )}
                      <button
                        onClick={() => revokeKey(key.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Revoke
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {apiKeys.length === 0 && (
          <p className="text-gray-500 text-center py-8">No API keys created yet</p>
        )}
      </div>
    </div>
  )
}
