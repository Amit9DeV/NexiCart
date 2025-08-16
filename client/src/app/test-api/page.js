'use client';

import { useState } from 'react';
import { authAPI, ordersAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function TestAPIPage() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Check localStorage
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('🔍 localStorage check:', { token: !!token, user: !!user });
      
      if (token) {
        console.log('🔍 Token preview:', token.substring(0, 20) + '...');
      }

      // Test 2: Test auth/me endpoint
      try {
        console.log('🔍 Testing auth/me...');
        const authResponse = await authAPI.getMe();
        console.log('✅ auth/me success:', authResponse.data);
        results.auth = { success: true, data: authResponse.data };
      } catch (error) {
        console.error('❌ auth/me failed:', error);
        results.auth = { 
          success: false, 
          error: error.message,
          status: error.response?.status,
          data: error.response?.data
        };
      }

      // Test 3: Test orders endpoint
      try {
        console.log('🔍 Testing orders/myorders...');
        const ordersResponse = await ordersAPI.getMyOrders();
        console.log('✅ orders/myorders success:', ordersResponse.data);
        results.orders = { success: true, data: ordersResponse.data };
      } catch (error) {
        console.error('❌ orders/myorders failed:', error);
        results.orders = { 
          success: false, 
          error: error.message,
          status: error.response?.status,
          data: error.response?.data
        };
      }

    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setLoading(false);
    }

    setResults(results);
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setResults({});
    console.log('🔍 Auth cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Authentication Test</h1>
        
        <div className="flex gap-4 mb-6">
          <Button onClick={testAuth} disabled={loading}>
            {loading ? 'Testing...' : 'Test Authentication'}
          </Button>
          <Button onClick={clearAuth} variant="outline">
            Clear Auth
          </Button>
        </div>

        {Object.keys(results).length > 0 && (
          <div className="space-y-4">
            {Object.entries(results).map(([testName, result]) => (
              <Card key={testName}>
                <CardHeader>
                  <CardTitle className="capitalize">{testName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`p-4 rounded-lg ${
                    result.success 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className={`font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                      {result.success ? '✅ Success' : '❌ Failed'}
                    </p>
                    {result.error && (
                      <p className="text-sm text-red-600 mt-1">
                        Error: {result.error}
                      </p>
                    )}
                    {result.status && (
                      <p className="text-sm text-gray-600 mt-1">
                        Status: {result.status}
                      </p>
                    )}
                    {result.data && (
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-2">
              <p>1. Click "Test Authentication" to test the API calls</p>
              <p>2. Check the browser console (F12) for detailed logs</p>
              <p>3. If you get 403 errors, try "Clear Auth" and log in again</p>
              <p>4. The logs will show exactly what's happening with the requests</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
