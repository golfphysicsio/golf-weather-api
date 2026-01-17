import { useState } from 'react'

export default function ApiPlayground({ apiBase }) {
  const [apiKey, setApiKey] = useState('')
  const [endpoint, setEndpoint] = useState('/api/v1/trajectory')
  const [method, setMethod] = useState('POST')
  const [body, setBody] = useState(JSON.stringify({
    shot: {
      ball_speed_mph: 150,
      launch_angle_deg: 12,
      spin_rate_rpm: 2500
    },
    conditions: {
      temperature_f: 72,
      humidity_percent: 50,
      altitude_ft: 500,
      wind_speed_mph: 10,
      wind_direction_deg: 45
    }
  }, null, 2))
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [responseTime, setResponseTime] = useState(null)
  const [curlCopied, setCurlCopied] = useState(false)

  const presets = [
    {
      name: 'Trajectory Calculation',
      endpoint: '/api/v1/trajectory',
      method: 'POST',
      body: {
        shot: {
          ball_speed_mph: 150,
          launch_angle_deg: 12,
          spin_rate_rpm: 2500
        },
        conditions: {
          temperature_f: 72,
          humidity_percent: 50,
          altitude_ft: 500,
          wind_speed_mph: 10,
          wind_direction_deg: 45
        }
      }
    },
    {
      name: 'Health Check',
      endpoint: '/api/v1/health',
      method: 'GET',
      body: null
    },
    {
      name: 'High Altitude Shot',
      endpoint: '/api/v1/trajectory',
      method: 'POST',
      body: {
        shot: {
          ball_speed_mph: 165,
          launch_angle_deg: 10.5,
          spin_rate_rpm: 2800
        },
        conditions: {
          temperature_f: 65,
          humidity_percent: 30,
          altitude_ft: 5280,
          wind_speed_mph: 5,
          wind_direction_deg: 180
        }
      }
    },
    {
      name: 'Cold Weather Shot',
      endpoint: '/api/v1/trajectory',
      method: 'POST',
      body: {
        shot: {
          ball_speed_mph: 145,
          launch_angle_deg: 14,
          spin_rate_rpm: 3000
        },
        conditions: {
          temperature_f: 40,
          humidity_percent: 80,
          altitude_ft: 0,
          wind_speed_mph: 15,
          wind_direction_deg: 270
        }
      }
    }
  ]

  const loadPreset = (preset) => {
    setEndpoint(preset.endpoint)
    setMethod(preset.method)
    setBody(preset.body ? JSON.stringify(preset.body, null, 2) : '')
  }

  const sendRequest = async () => {
    if (!apiKey && endpoint !== '/api/v1/health') {
      setError('API key is required for this endpoint')
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)

    const startTime = performance.now()

    try {
      const url = `${apiBase}${endpoint}`
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      }

      if (apiKey) {
        options.headers['X-API-Key'] = apiKey
      }

      if (method !== 'GET' && body) {
        options.body = body
      }

      const res = await fetch(url, options)
      const endTime = performance.now()
      setResponseTime(Math.round(endTime - startTime))

      const data = await res.json()
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: data
      })
    } catch (err) {
      setError(`Request failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">API Playground</h2>

      {/* Presets */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Presets</h3>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, i) => (
            <button
              key={i}
              onClick={() => loadPreset(preset)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-lg font-semibold">Request</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
              placeholder="golf_xxxxxxxx..."
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint</label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="border rounded-lg px-3 py-2"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>

          {method !== 'GET' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Request Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
                rows={12}
              />
            </div>
          )}

          <button
            onClick={sendRequest}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Request'}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Response Panel */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Response</h3>
            {responseTime && (
              <span className="text-sm text-gray-500">{responseTime}ms</span>
            )}
          </div>

          {response ? (
            <>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  response.status >= 200 && response.status < 300
                    ? 'bg-green-100 text-green-800'
                    : response.status >= 400
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {response.status} {response.statusText}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Response Body</label>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                  {JSON.stringify(response.body, null, 2)}
                </pre>
              </div>

              <div>
                <details className="text-sm">
                  <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                    Response Headers
                  </summary>
                  <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto">
                    {JSON.stringify(response.headers, null, 2)}
                  </pre>
                </details>
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Send a request to see the response
            </div>
          )}
        </div>
      </div>

      {/* cURL Example */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">cURL Command</h3>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm">
{`curl -X ${method} "${apiBase}${endpoint}" \\
  -H "Content-Type: application/json" \\${apiKey ? `
  -H "X-API-Key: ${apiKey}" \\` : ''}${method !== 'GET' && body ? `
  -d '${body.replace(/\n/g, '').replace(/\s+/g, ' ')}'` : ''}`}
        </pre>
        <button
          onClick={() => {
            const curl = `curl -X ${method} "${apiBase}${endpoint}" -H "Content-Type: application/json"${apiKey ? ` -H "X-API-Key: ${apiKey}"` : ''}${method !== 'GET' && body ? ` -d '${body.replace(/\n/g, '').replace(/\s+/g, ' ')}'` : ''}`
            navigator.clipboard.writeText(curl)
            setCurlCopied(true)
            setTimeout(() => setCurlCopied(false), 2000)
          }}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          {curlCopied ? 'Copied!' : 'Copy to clipboard'}
        </button>
      </div>
    </div>
  )
}
