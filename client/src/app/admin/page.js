"use client";

import React, { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Line, Bar, Doughnut } from "react-chartjs-2";
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
} from "chart.js";

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


export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "admin") {
        router.push("/admin/login");
        return;
      }
      
      const fetchStats = async () => {
        try {
          const { data } = await adminAPI.getDashboardStats();
          setStats(data.data);
        } catch (error) {
          console.error("Failed to fetch stats", error);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || user.role !== "admin") {
    return null; // Will redirect to login
  }

  if (authLoading || loading) {
    return (<>
    <div>Loading...</div>
    </>);
  }

  if (!stats) {
   return (
     <>
       <div>Failed to load stats.</div>
     </>
   );
 }

 // Sample data and options for charts
 const monthlyRevenueData = {
   labels: stats.monthlyChart.map((entry) => `${entry._id.month}-${entry._id.year}`),
   datasets: [
     {
       label: "Revenue",
       data: stats.monthlyChart.map((entry) => entry.revenue),
       backgroundColor: "rgba(75,192,192,0.4)",
       borderColor: "rgba(75,192,192,1)",
       borderWidth: 1,
       fill: true,
     },
   ],
 };

 const monthlyRevenueOptions = {
   responsive: true,
   plugins: {
     legend: {
       position: "top",
     },
     title: {
       display: true,
       text: "Monthly Revenue Chart",
     },
   },
 };

 // Top Products Chart Data
 const topProductsData = {
   labels: stats.topProducts.map(product => product.product.name),
   datasets: [
     {
       label: "Units Sold",
       data: stats.topProducts.map(product => product.totalSold),
       backgroundColor: [
         "rgba(255, 99, 132, 0.8)",
         "rgba(54, 162, 235, 0.8)",
         "rgba(255, 205, 86, 0.8)",
         "rgba(75, 192, 192, 0.8)",
         "rgba(153, 102, 255, 0.8)"
       ],
       borderColor: [
         "rgba(255, 99, 132, 1)",
         "rgba(54, 162, 235, 1)",
         "rgba(255, 205, 86, 1)",
         "rgba(75, 192, 192, 1)",
         "rgba(153, 102, 255, 1)"
       ],
       borderWidth: 1,
     },
   ],
 };

 // Order Status Distribution
 const orderStatusData = {
   labels: stats.orderStatuses.map(status => status._id),
   datasets: [
     {
       data: stats.orderStatuses.map(status => status.count),
       backgroundColor: [
         "rgba(255, 206, 84, 0.8)",
         "rgba(75, 192, 192, 0.8)",
         "rgba(153, 102, 255, 0.8)",
         "rgba(255, 99, 132, 0.8)",
         "rgba(54, 162, 235, 0.8)"
       ],
       borderWidth: 2,
     },
   ],
 };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/create">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Create Admin
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Manage Products
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Manage Orders
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Analytics
            </Button>
          </Link>
          <Link href="/admin/homepage-sections">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white">
              Homepage Sections
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              System Settings
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{stats.overview.totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{stats.overview.totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{stats.overview.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p>${stats.overview.totalRevenue}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{stats.overview.monthlyUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{stats.overview.monthlyOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p>${stats.overview.monthlyRevenue}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{stats.overview.weeklyUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{stats.overview.weeklyOrders}</p>
          </CardContent>
        </Card>
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Monthly Revenue Trend</h3>
        <Line data={monthlyRevenueData} options={monthlyRevenueOptions} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Top Selling Products</h3>
        <Bar data={topProductsData} options={{responsive: true}} />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Order Status Distribution</h3>
        <Doughnut data={orderStatusData} options={{responsive: true}} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Low Stock Alert</h3>
        <div className="space-y-2">
          {stats.lowStockProducts.map(product => (
            <div key={product._id} className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-200">
              <span className="font-medium">{product.name}</span>
              <span className="text-red-600 font-bold">Stock: {product.stock}</span>
            </div>
          ))}
          {stats.lowStockProducts.length === 0 && (
            <p className="text-green-600">All products are well stocked!</p>
          )}
        </div>
      </div>
    </div>

    <h2 className="text-3xl font-bold my-6">Recent Orders</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.recentOrders.map(order => (
        <Card key={order._id}>
          <CardHeader>
            <CardTitle>Order #{order._id.slice(-8)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Customer:</strong> {order.user.name}</p>
            <p><strong>Total:</strong> ${order.totalPrice}</p>
            <p><strong>Status:</strong> {order.orderStatus}</p>
          </CardContent>
        </Card>
      ))}
    </div>
    </div>
  );
}

