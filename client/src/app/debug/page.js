'use client';

import { useState } from 'react';
import { productsAPI } from '@/lib/api';
import axios from 'axios';

export default function Debug() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testDirectAxios = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setResults(prev => ({
        ...prev,
        directAxios: {
          success: true,
          data: response.data,
          productsCount: response.data?.data?.length || 0
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        directAxios: {
          success: false,
          error: error.message,
          details: error.response?.data || 'No response data'
        }
      }));
    }
    setLoading(false);
  };

  const testViaAPI = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getProducts();
      setResults(prev => ({
        ...prev,
        viaAPI: {
          success: true,
          data: response.data,
          productsCount: response.data?.data?.length || 0
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        viaAPI: {
          success: false,
          error: error.message,
          details: error.response?.data || 'No response data'
        }
      }));
    }
    setLoading(false);
  };

  const testEnvVar = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    setResults(prev => ({
      ...prev,
      envVar: {
        NEXT_PUBLIC_API_URL: apiUrl || 'NOT SET',
        defaultUrl: 'http://localhost:5000/api'
      }
    }));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">API Debug Page</h1>
      
      <div className="space-y-4 mb-8">
        <button 
          onClick={testEnvVar}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          Test Environment Variables
        </button>
        
        <button 
          onClick={testDirectAxios}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded mr-4"
        >
          Test Direct Axios Call
        </button>
        
        <button 
          onClick={testViaAPI}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded mr-4"
        >
          Test Via API Helper
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <div className="space-y-6">
        {Object.entries(results).map(([testName, result]) => (
          <div key={testName} className="border p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">{testName}</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
