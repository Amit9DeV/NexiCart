'use client';

import { useState } from 'react';
import { productsAPI } from '@/lib/api';

export default function TestAPI() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await productsAPI.getProducts({ limit: 5 });
      setResult(response.data);
    } catch (err) {
      setError({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          baseURL: err.config?.baseURL,
          method: err.config?.method
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <p><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
            <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={testAPI}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API Connection'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Message:</strong> {error.message}</p>
              <p><strong>Status:</strong> {error.status}</p>
              <p><strong>URL:</strong> {error.config?.url}</p>
              <p><strong>Base URL:</strong> {error.config?.baseURL}</p>
              <p><strong>Method:</strong> {error.config?.method}</p>
              {error.data && (
                <div>
                  <strong>Response Data:</strong>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(error.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Success!</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Status:</strong> {result.success ? 'Success' : 'Failed'}</p>
              <p><strong>Count:</strong> {result.count || result.data?.length || 'N/A'}</p>
            </div>
            <div className="mt-4">
              <strong>Response Data:</strong>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
