'use client';

import { useState } from 'react';
import { ordersAPI, authAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function DebugPage() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Check localStorage
      try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        results.localStorage = {
          success: true,
          data: {
            hasToken: !!token,
            tokenLength: token ? token.length : 0,
            hasUser: !!user,
            userData: user ? JSON.parse(user) : null
          },
          message: `Token: ${!!token}, User: ${!!user}`
        };
      } catch (error) {
        results.localStorage = {
          success: false,
          error: error.message,
          message: 'Failed to check localStorage'
        };
      }

      // Test 2: Check if user is authenticated
      try {
        const userResponse = await authAPI.getMe();
        results.auth = {
          success: true,
          data: userResponse.data,
          message: 'User authenticated successfully'
        };
      } catch (error) {
        results.auth = {
          success: false,
          error: error.message,
          status: error.response?.status,
          data: error.response?.data,
          message: `Authentication failed: ${error.response?.status} - ${error.response?.data?.error || error.message}`
        };
      }

      // Test 3: Try to get user orders
      try {
        const ordersResponse = await ordersAPI.getMyOrders();
        results.orders = {
          success: true,
          data: ordersResponse.data,
          count: ordersResponse.data.data?.length || 0,
          message: `Found ${ordersResponse.data.data?.length || 0} orders`
        };
      } catch (error) {
        results.orders = {
          success: false,
          error: error.message,
          status: error.response?.status,
          data: error.response?.data,
          message: `Failed to fetch orders: ${error.response?.status} - ${error.response?.data?.error || error.message}`
        };
      }

      // Test 4: Test server connectivity
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          results.connectivity = {
            success: true,
            status: response.status,
            message: 'Server is reachable'
          };
        } else {
          results.connectivity = {
            success: false,
            status: response.status,
            message: `Server responded with status ${response.status}`
          };
        }
      } catch (error) {
        results.connectivity = {
          success: false,
          error: error.message,
          message: 'Server is not reachable'
        };
      }

      // Test 5: Test raw token request
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            results.rawToken = {
              success: true,
              data: data,
              message: 'Raw token request successful'
            };
          } else {
            const errorData = await response.json().catch(() => ({}));
            results.rawToken = {
              success: false,
              status: response.status,
              data: errorData,
              message: `Raw token request failed: ${response.status}`
            };
          }
        } else {
          results.rawToken = {
            success: false,
            message: 'No token found in localStorage'
          };
        }
      } catch (error) {
        results.rawToken = {
          success: false,
          error: error.message,
          message: 'Raw token request error'
        };
      }

    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setLoading(false);
    }

    setTestResults(results);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Debug & Testing</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API Connection Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTests} 
              disabled={loading}
              className="mb-4"
            >
              {loading ? 'Running Tests...' : 'Run API Tests'}
            </Button>

            {Object.keys(testResults).length > 0 && (
              <div className="space-y-4">
                {Object.entries(testResults).map(([testName, result]) => (
                  <div key={testName} className={`p-4 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <h3 className="font-semibold capitalize mb-2">{testName}</h3>
                    <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                      {result.message}
                    </p>
                    {result.data && (
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                    {result.error && (
                      <p className="mt-2 text-xs text-red-600">
                        Error: {result.error}
                      </p>
                    )}
                    {result.status && (
                      <p className="mt-2 text-xs text-gray-600">
                        Status: {result.status}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
              <p><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
              <p><strong>Base URL:</strong> {process.env.NODE_ENV === 'development' ? '/api' : 'http://localhost:5000/api'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
