'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { FiShield, FiArrowRight, FiLock, FiSettings, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      // Check if the logged-in user is actually an admin
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.role === 'admin') {
          toast.success('Welcome to Admin Dashboard!');
          router.push('/admin');
        } else {
          toast.error('Access denied. Admin privileges required.');
          // Logout the user since they're not an admin
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
    setLoading(false);
  };

  // Quick fill for demo purposes
  const fillDemoCredentials = () => {
    setEmail('admin@nexicart.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-2">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="flex flex-col items-center mb-6 relative z-10"
      >
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl mb-4 relative">
          <FiShield className="w-8 h-8 text-white" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
            <FiSettings className="w-3 h-3 text-amber-900" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Admin Portal</h1>
        <p className="text-purple-200 text-center max-w-md">
          Secure access to NexiCart administration dashboard
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.1 }} 
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-white/90 font-medium">Admin Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@nexicart.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400"
                  />
                  <FiUser className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="password" className="text-white/90 font-medium">Admin Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400"
                  />
                  <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4" />
                </div>
              </div>

              {/* Demo Credentials Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-xs text-purple-300 hover:text-purple-200 underline transition-colors"
                >
                  Fill Demo Credentials
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Access Dashboard
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <FiShield className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-amber-200 font-medium text-sm">Security Notice</h4>
                  <p className="text-amber-300/80 text-xs mt-1">
                    This portal is restricted to authorized administrators only. 
                    All access attempts are logged and monitored.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Need customer access?{' '}
                <Link href="/auth/login" className="text-purple-300 hover:text-purple-200 underline font-medium">
                  Customer Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 text-center relative z-10"
      >
        <p className="text-white/40 text-xs">
          © 2024 NexiCart Admin Portal. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
