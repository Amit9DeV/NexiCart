'use client';

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Layout from '@/components/layout/Layout';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          {children}
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}
