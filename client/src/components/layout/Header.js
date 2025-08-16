'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiMenu,
  FiX,
  FiHeart,
  FiBell,
  FiChevronDown,
  FiHome,
  FiGrid,
  FiStar,
  FiTruck,
  FiShield,
  FiHeadphones
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
      // Hide top bar on scroll down, show on scroll up (mobile only)
      if (window.innerWidth < 1024) {
        if (window.scrollY > lastScrollY && window.scrollY > 40) {
          setShowTopBar(false);
        } else {
          setShowTopBar(true);
        }
        setLastScrollY(window.scrollY);
      } else {
        setShowTopBar(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const categories = [
    { name: 'Furniture', icon: FiHome, href: '/category/furniture' },
    { name: 'Electronics', icon: FiGrid, href: '/category/electronics' },
    { name: 'Fashion', icon: FiStar, href: '/category/fashion' },
    { name: 'Home & Garden', icon: FiTruck, href: '/category/home-garden' },
    { name: 'Sports', icon: FiShield, href: '/category/sports' },
    { name: 'Books', icon: FiHeadphones, href: '/category/books' },
  ];

  return (
    <header className={`nav-nexkartin transition-all duration-300 backdrop-blur-md ${scrolled ? 'shadow-2xl' : ''}`}
      style={{ zIndex: 50 }}>
      {/* Top Bar (hide on scroll in mobile) */}
      <div className={` hidden sm:block liquid-glass py-1.5 sm:py-2 text-xs sm:text-sm transition-transform duration-300 ${showTopBar ? 'translate-y-0' : '-translate-y-full'} fixed top-0 left-0 w-full lg:static lg:translate-y-0`} style={{ zIndex: 51 }}>
        <div className="container-nexkartin">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <span className="flex items-center text-black font-semibold" style={{textShadow: '0 1px 2px rgba(255,255,255,0.8)'}}>
                <FiTruck className="w-4 h-4 mr-1.5" />
                FREE SHIPPING FOR ALL ORDERS OF $150
              </span>
              <span className="hidden md:flex items-center text-black font-semibold" style={{textShadow: '0 1px 2px rgba(255,255,255,0.8)'}}>
                <FiHeadphones className="w-4 h-4 mr-1.5" />
                24/7 SUPPORT
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Action Buttons - Top Bar */}
              <div className="flex items-center space-x-1 lg:hidden">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="nav-icon-small"
                  aria-label="Open search"
                >
                  <FiSearch className="w-4 h-4 text-black/70" />
                </button>
                <button className="relative nav-icon-small">
                  <FiHeart className="w-4 h-4 text-black/70" />
                  <span className="absolute -top-0.5 -right-0.5 liquid-glass text-black text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    0
                  </span>
                </button>
                <button className="relative nav-icon-small">
                  <FiBell className="w-4 h-4 text-black/70" />
                  <span className="absolute -top-0.5 -right-0.5 liquid-glass text-black text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    3
                  </span>
                </button>
              </div>
              
              <select className="liquid-glass text-black text-xs sm:text-sm border-none focus:outline-none bg-transparent">
                <option>English</option>
                <option>Deutsch</option>
                <option>French</option>
              </select>
              <select className="liquid-glass text-black text-xs sm:text-sm border-none focus:outline-none bg-transparent">
                <option>United States (USD)</option>
                <option>Deutschland (EUR)</option>
                <option>Japan (JPY)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation (sticky on mobile) */}
      <div className="container-nexkartin sticky top-0 left-0 liquid-glass z-50" style={{ zIndex: 52 }}>
        <div className="flex items-center justify-between py-1 sm:py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 min-w-[44px]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 logo-icon">
              <span className="text-black font-extrabold text-xl sm:text-2xl" style={{textShadow: '0 2px 4px rgba(255,255,255,0.8)'}}>N</span>
            </div>
            <div className="block">
              <h1 className="text-lg sm:text-2xl font-bold text-black leading-tight" style={{textShadow: '0 2px 4px rgba(255,255,255,0.8)'}}>NexiCart</h1>
              <p className="text-[10px] sm:text-xs text-black font-medium leading-tight" style={{textShadow: '0 1px 2px rgba(255,255,255,0.8)'}}>Premium Shopping</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-4 sm:mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for products..."
                className="liquid-glass-input pr-10 text-sm text-black placeholder:text-black/60"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                <FiSearch className="w-5 h-5 text-black/60" />
              </button>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center space-x-2">
              <button className="relative nav-icon">
                <FiHeart className="w-5 h-5 text-black/70" />
                <span className="absolute -top-1 -right-1 liquid-glass text-black text-[10px] sm:text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  0
                </span>
              </button>

              <button className="relative nav-icon">
                <FiBell className="w-5 h-5 text-black/70" />
                <span className="absolute -top-1 -right-1 liquid-glass text-black text-[10px] sm:text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  3
                </span>
              </button>
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative nav-icon">
              <FiShoppingCart className="w-5 h-5 text-black/70" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 liquid-glass text-black text-[10px] sm:text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 sm:space-x-2 nav-icon">
                  <FiUser className="w-5 h-5 text-black/70" />
                  <span className="hidden sm:inline text-xs sm:text-sm font-medium text-black" style={{textShadow: '0 1px 2px rgba(255,255,255,0.8)'}}>{user.name}</span>
                  <FiChevronDown className="w-4 h-4 text-black/50" />
                </button>
                <div className="absolute right-0 mt-2 w-44 sm:w-48 liquid-glass rounded-lg shadow-lg border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/profile" className="block px-4 py-2 text-xs sm:text-sm text-black hover:bg-white/10 font-medium">
                      My Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-xs sm:text-sm text-black hover:bg-white/10 font-medium">
                      My Orders
                    </Link>
                    <Link href="/wishlist" className="block px-4 py-2 text-xs sm:text-sm text-black hover:bg-white/10 font-medium">
                      Wishlist
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2 text-xs sm:text-sm text-indigo-600 hover:bg-white/10 font-medium">
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-2 border-white/20" />
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-white/10 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button className="btn-sophisticated btn-sophisticated-primary min-w-[44px] min-h-[44px] px-3 sm:px-4 text-xs sm:text-sm">
                  <FiUser className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Sign In</span>
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden nav-icon"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-5 h-5 text-black/70" />
              ) : (
                <FiMenu className="w-5 h-5 text-black/70" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="liquid-glass border-t border-white/20">
        <div className="container-nexkartin">
          <nav className="hidden lg:flex items-center space-x-8 py-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="nav-link-nexkartin flex items-center space-x-2"
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </Link>
            ))}
          </nav>
          {/* Mobile horizontal scrollable category nav */}
          <nav className="flex lg:hidden justify-center items-center gap-2 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="flex justify-center gap-1 px-3 py-1.5 rounded-full liquid-glass  text-xs font-medium text-black whitespace-nowrap hover:bg-white/20 transition-colors"
                style={{ minWidth: 0, textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}
              >
                <category.icon className="w-4 h-4 mr-1" />
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Search */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden liquid-glass border-t border-white/20"
          >
            <div className="container-nexkartin py-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  className="liquid-glass-input pr-10 text-sm text-black placeholder:text-black/60"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                  <FiSearch className="w-5 h-5 text-black/60" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden liquid-glass border-t border-white/20"
          >
            <div className="container-nexkartin py-4">
              <nav className="space-y-3">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="nav-link-nexkartin flex items-center space-x-2 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <category.icon className="w-5 h-5" />
                    <span>{category.name}</span>
                  </Link>
                ))}
                <hr className="my-3 border-white/20" />
                {user ? (
                  <div className="space-y-2">
                    <Link href="/profile" className="nav-link-nexkartin block py-2">
                      My Profile
                    </Link>
                    <Link href="/orders" className="nav-link-nexkartin block py-2">
                      My Orders
                    </Link>
                    <Link href="/wishlist" className="nav-link-nexkartin block py-2">
                      Wishlist
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="nav-link-nexkartin block py-2 text-indigo-300 font-medium">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="nav-link-nexkartin block w-full text-left py-2 text-red-300"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link href="/auth/login">
                    <Button className="btn-nexkartin btn-nexkartin-primary w-full text-xs sm:text-sm liquid-glass-button">
                      <FiUser className="w-4 h-4 mr-1 sm:mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
