import React, { useState } from 'react';

function ApiPlayground({ token, apiUrl }) {
  const [endpoint, setEndpoint] = useState('/weather');
  const [method, setMethod] = useState('GET');
  const [apiKey, setApiKey] = useState('');
  const [params, setParams] = useState('lat=33.7&lon=-84.4');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const commonEndpoints = [
    { path: '/weather', method: 'GET', params: 'lat=33.7&lon=-84.4', description: 'Get weather data for location' },
    { path: '/forecast', method: 'GET', params: 'lat=33.7&lon=-84.4&days=7', description: 'Get weather forecast' },
    { path: '/conditions', method: 'GET', params: 'lat=33.7&lon=-84.4', description: 'Get playing conditions' },
  ];

  const loadExample = (example) => {
    setEndpoint(example.path);
    setMethod(example.method);
    setParams(example.params);
  };

  const executeRequest = async () => {
    if (!apiKey) {
      alert('Please enter an API key');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Build URL
      const baseUrl = apiUrl.replace('/admin', ''); // Remove /admin if present
      let url = `${baseUrl}${endpoint}`;
      
      if (method === 'GET' && params) {
        url += `?${params}`;
      }

      // Build request options
      const options = {
        method,
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
      };

      if (method !== 'GET' && requestBody) {
        options.body = requestBody;
      }

      const startTime = performance.now();
      const res = await fetch(url, options);
      const endTime = performance.now();
      const latency = (endTime - startTime).toFixed(2);

      const data = await res.json();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        latency: `${latency}ms`,
        headers: Object.fromEntries(res.headers.entries()),
        data,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">API Playground</h2>
        <p className="text-gray-600 mt-1">
          Test your Golf Physics API endpoints with a real API key
        </p>
      </div>

      {/* Quick Examples */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-3">Quick Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {commonEndpoints.map((example, index) => (
            <button
              key={index}
              onClick={() => loadExample(example)}
              className="text-left p-3 bg-white border border-blue-300 rounded hover:bg-blue-100 transition-colors"
            >
              <div className="font-mono text-sm text-blue-800">{example.method} {example.path}</div>
              <div className="text-xs text-gray-600 mt-1">{example.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Request Builder */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Request</h3>
        
        <div className="space-y-4">
          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key *
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="golf_xxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get an API key from the "API Keys" tab
            </p>
          </div>

          {/* Method & Endpoint */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endpoint
              </label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="/weather"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono"
              />
            </div>
          </div>

          {/* Query Parameters (for GET) */}
          {method === 'GET' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Query Parameters
              </label>
              <input
                type="text"
                value={params}
                onChange={(e) => setParams(e.target.value)}
                placeholder="lat=33.7&lon=-84.4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: param1=value1&param2=value2
              </p>
            </div>
          )}

          {/* Request Body (for POST/PUT) */}
          {method !== 'GET' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Body (JSON)
              </label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder='{"key": "value"}'
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm"
              />
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={executeRequest}
            disabled={loading || !apiKey}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? 'Sending Request...' : 'Send Request'}
          </button>
        </div>
      </div>

      {/* Response */}
      {(response || error) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Response</h3>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {response && (
            <div className="space-y-4">
              {/* Status & Latency */}
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  response.status >= 200 && response.status < 300
                    ? 'bg-green-100 text-green-800'
                    : response.status >= 400
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {response.status} {response.statusText}
                </div>
                <div className="text-sm text-gray-600">
                  ⚡ {response.latency}
                </div>
              </div>

              {/* Headers */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Headers</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                  <pre className="text-xs font-mono text-gray-700">
                    {JSON.stringify(response.headers, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Response Body */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Response Body</h4>
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm font-mono text-green-400">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">💡 Tips</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Create a test API key from the "API Keys" tab with Free tier</li>
          <li>• Use the Quick Examples above to get started</li>
          <li>• Check rate limit headers in the response (X-RateLimit-Limit)</li>
          <li>• Your API documentation is at: <a href={`${apiUrl}/docs`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{apiUrl}/docs</a></li>
        </ul>
      </div>
    </div>
  );
}

export default ApiPlayground;
