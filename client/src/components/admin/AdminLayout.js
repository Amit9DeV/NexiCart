'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiUsers, 
  FiPackage, 
  FiShoppingCart, 
  FiBarChart3, 
  FiSettings, 
  FiMenu, 
  FiX, 
  FiLogOut,
  FiUserPlus,
  FiGrid,
  FiTrendingUp
} from 'react-icons/fi';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

const AdminLayout = ({ children }) => {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        toast.error('Admin access required');
        router.push('/admin/login');
        return;
      }
    }
  }, [user, authLoading, router]);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: FiHome,
      current: pathname === '/admin'
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: FiPackage,
      current: pathname === '/admin/products'
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: FiShoppingCart,
      current: pathname === '/admin/orders'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: FiUsers,
      current: pathname === '/admin/users'
    },
    {
      name: 'Homepage Sections',
      href: '/admin/homepage-sections',
      icon: FiGrid,
      current: pathname === '/admin/homepage-sections'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: FiTrendingUp,
      current: pathname === '/admin/analytics'
    },
    {
      name: 'Create Admin',
      href: '/admin/create',
      icon: FiUserPlus,
      current: pathname === '/admin/create'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: FiSettings,
      current: pathname === '/admin/settings'
    }
  ];

  const handleLogout = async () => {
    logout();
    router.push('/admin/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" text="Loading admin panel..." />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">NexiCart Admin</span>
          </Link>
          
          <button
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    item.current
                      ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500'
                      : 'text-gray-700 hover:text-indigo-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'
                  }`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center px-3 py-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              className="w-full btn-nexkartin btn-nexkartin-outline text-left justify-start"
            >
              <FiLogOut className="mr-3 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu className="w-5 h-5" />
            </button>
            
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">NC</span>
              </div>
              <span className="font-semibold text-gray-900">Admin</span>
            </Link>

            <div className="w-8" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
