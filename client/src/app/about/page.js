'use client';

import { FiUsers, FiTrendingUp, FiAward, FiHeart, FiShield, FiGlobe } from 'react-icons/fi';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function About() {
  const stats = [
    { label: 'Happy Customers', value: '50K+', icon: <FiUsers className="w-8 h-8" /> },
    { label: 'Products Sold', value: '100K+', icon: <FiTrendingUp className="w-8 h-8" /> },
    { label: 'Awards Won', value: '25+', icon: <FiAward className="w-8 h-8" /> },
    { label: 'Countries Served', value: '15+', icon: <FiGlobe className="w-8 h-8" /> }
  ];

  const values = [
    {
      icon: <FiHeart className="w-12 h-12" />,
      title: 'Customer First',
      description: 'Every decision we make starts with our customers. We listen, adapt, and deliver exceptional experiences.'
    },
    {
      icon: <FiShield className="w-12 h-12" />,
      title: 'Trust & Security',
      description: 'Your trust is our foundation. We maintain the highest standards of security and transparency.'
    },
    {
      icon: <FiTrendingUp className="w-12 h-12" />,
      title: 'Innovation',
      description: 'We constantly evolve and embrace new technologies to improve your shopping experience.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      position: 'CEO & Founder',
      bio: 'Visionary leader with 15+ years in e-commerce, passionate about creating exceptional shopping experiences.',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Michael Chen',
      position: 'CTO',
      bio: 'Technology expert focused on building scalable, secure platforms that delight customers.',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Emily Rodriguez',
      position: 'Head of Design',
      bio: 'Creative director ensuring every interaction is beautiful, intuitive, and user-friendly.',
      image: '/api/placeholder/300/300'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">NexiCart</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            We're not just another e-commerce platform. We're your gateway to the future of shopping, 
            where technology meets convenience and quality meets affordability.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-xl text-gray-600">How we started and where we're headed</p>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-xl leading-relaxed mb-8">
                Founded in 2020, NexiCart emerged from a simple idea: shopping should be effortless, enjoyable, and accessible to everyone. 
                What started as a small team's vision has grown into a platform trusted by thousands of customers worldwide.
              </p>
              
              <p className="text-lg leading-relaxed mb-8">
                We believe that the future of commerce lies in the perfect blend of cutting-edge technology and human-centered design. 
                Every feature we build, every product we curate, and every service we offer is designed with one goal in mind: 
                making your life easier and more enjoyable.
              </p>
              
              <p className="text-lg leading-relaxed">
                Today, we continue to push boundaries, embracing new technologies like AI-powered recommendations, 
                sustainable packaging solutions, and seamless payment experiences. But our core mission remains unchanged: 
                to be your trusted partner in discovering amazing products and brands.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group p-8 rounded-2xl hover:bg-gray-50 transition-colors duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate people behind NexiCart
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">{member.name}</h3>
                <p className="text-purple-600 text-center mb-4 font-medium">{member.position}</p>
                <p className="text-gray-600 text-center leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Shop the Future?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied customers and discover your next favorite product today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-lg">
                Start Shopping
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 rounded-full font-semibold text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
