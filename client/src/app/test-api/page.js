'use client';

import { useState, useEffect } from 'react';

export default function TestAPI() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        setLoading(true);
        console.log('Testing API connection...');
        
        // Test direct fetch to the API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API Response:', result);
        setData(result);
        
      } catch (error) {
        console.error('API Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">API Test - Loading...</h1>
        <div>Testing connection to API...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">API Test - Error</h1>
        <div className="text-red-500">Error: {error}</div>
        <div className="mt-4">
          <p>Check the browser console for more details.</p>
          <p>Make sure the server is running on http://localhost:5000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test - Success!</h1>
      <div className="mb-4">
        <strong>Products found:</strong> {data?.count || 0}
      </div>
      <div className="mb-4">
        <strong>Success:</strong> {data?.success ? 'true' : 'false'}
      </div>
      
      {data?.data && data.data.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">First few products:</h2>
          <div className="space-y-4">
            {data.data.slice(0, 3).map((product) => (
              <div key={product._id} className="border p-4 rounded">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-green-600 font-bold">${product.price}</p>
                <p className="text-sm text-gray-500">Category: {product.category}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Raw API Response:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
