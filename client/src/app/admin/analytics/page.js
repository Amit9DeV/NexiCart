'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminAnalytics() {
  const { user } = useAuth();
  const router = useRouter();
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [salesAnalytics, setSalesAnalytics] = useState(null);
  const [period, setPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
    fetchAnalytics();
  }, [user, period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [userRes, salesRes] = await Promise.all([
        adminAPI.getUsersAnalytics(period),
        adminAPI.getSalesAnalytics(period)
      ]);
      setUserAnalytics(userRes.data.data);
      setSalesAnalytics(salesRes.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Redirecting to login...</h1>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Analytics...</div>;
  }

  // User Growth Chart Data
  const userGrowthData = {
    labels: userAnalytics?.map(entry => entry._id) || [],
    datasets: [
      {
        label: 'New Users',
        data: userAnalytics?.map(entry => entry.count) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  // Sales Chart Data
  const salesData = {
    labels: salesAnalytics?.map(entry => entry._id) || [],
    datasets: [
      {
        label: 'Revenue ($)',
        data: salesAnalytics?.map(entry => entry.revenue) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        yAxisID: 'y',
      },
      {
        label: 'Orders',
        data: salesAnalytics?.map(entry => entry.orders) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        yAxisID: 'y1',
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Performance',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/admin">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* Period Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Time Period</h3>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map(p => (
            <Button
              key={p}
              onClick={() => setPeriod(p)}
              variant={period === p ? 'default' : 'outline'}
              size="sm"
            >
              {p === '24h' ? '24 Hours' : 
               p === '7d' ? '7 Days' : 
               p === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total New Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {userAnalytics?.reduce((sum, entry) => sum + entry.count, 0) || 0}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${salesAnalytics?.reduce((sum, entry) => sum + entry.revenue, 0)?.toFixed(2) || '0.00'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {salesAnalytics?.reduce((sum, entry) => sum + entry.orders, 0) || 0}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">
              ${salesAnalytics && salesAnalytics.length > 0 
                ? (salesAnalytics.reduce((sum, entry) => sum + entry.revenue, 0) / 
                   salesAnalytics.reduce((sum, entry) => sum + entry.orders, 0)).toFixed(2)
                : '0.00'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">User Growth</h3>
          <Line data={userGrowthData} options={{ responsive: true }} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Sales Performance</h3>
          <Bar data={salesData} options={salesOptions} />
        </div>
      </div>

      {/* Advanced Metrics */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h4 className="font-semibold text-gray-600">User Acquisition Rate</h4>
            <p className="text-lg font-bold text-blue-600">
              {userAnalytics?.length > 1 ? 
                `${((userAnalytics[userAnalytics.length - 1]?.count - userAnalytics[0]?.count) / 
                    userAnalytics[0]?.count * 100).toFixed(1)}%` : '0%'}
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-gray-600">Revenue Growth</h4>
            <p className="text-lg font-bold text-green-600">
              {salesAnalytics?.length > 1 ? 
                `${((salesAnalytics[salesAnalytics.length - 1]?.revenue - salesAnalytics[0]?.revenue) / 
                    salesAnalytics[0]?.revenue * 100).toFixed(1)}%` : '0%'}
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-gray-600">Order Frequency</h4>
            <p className="text-lg font-bold text-purple-600">
              {salesAnalytics?.length > 0 ? 
                `${(salesAnalytics.reduce((sum, entry) => sum + entry.orders, 0) / salesAnalytics.length).toFixed(1)} orders/day` : '0 orders/day'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
