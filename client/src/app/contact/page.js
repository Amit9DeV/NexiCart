'use client';

import { useState } from 'react';
import { MdEmail, MdPhone, MdLocationOn, MdAccessTime, MdOutlineSupportAgent, MdPublic } from 'react-icons/md';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const info = [
    { icon: <MdEmail className="w-8 h-8 text-yellow-500" />, title: 'Email Us', detail: 'support@nexicart.com' },
    { icon: <MdPhone className="w-8 h-8 text-yellow-500" />, title: 'Call Us', detail: '+1 (800) 123-4567' },
    { icon: <MdLocationOn className="w-8 h-8 text-yellow-500" />, title: 'Visit Us', detail: '123 Shopping Blvd, E-commerce City, USA' },
    { icon: <MdAccessTime className="w-8 h-8 text-yellow-500" />, title: 'Working Hours', detail: 'Mon - Fri: 9am - 6pm' }
  ];

  const support = [
    { icon: <MdOutlineSupportAgent className="w-8 h-8 text-purple-500" />, title: 'Customer Support', detail: 'Our dedicated team is available 24/7 to help you.' },
    { icon: <MdPublic className="w-8 h-8 text-purple-500" />, title: 'Connect Online', detail: 'Find us on social media and follow our updates.' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    toast.success('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
<div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            We&apos;re Here to <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Help</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Contact us for any queries or support. Our team is always ready to assist you.
          </p>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {info.map((item, index) => (
              <div key={index} className="text-center group">
                {item.icon}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">{item.title}</h3>
                <p className="text-gray-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {support.map((item, index) => (
              <div key={index} className="flex items-center bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                {item.icon}
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-lg font-semibold mb-2 text-left">Name</label>
                <input type="text" id="name" className="w-full px-4 py-3 rounded-full text-gray-900 focus:ring-2 focus:ring-yellow-500"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-lg font-semibold mb-2 text-left">Email</label>
                <input type="email" id="email" className="w-full px-4 py-3 rounded-full text-gray-900 focus:ring-2 focus:ring-yellow-500"/>
              </div>
              <div>
                <label htmlFor="message" className="block text-lg font-semibold mb-2 text-left">Message</label>
                <textarea id="message" rows="5" className="w-full px-4 py-3 rounded-2xl text-gray-900 focus:ring-2 focus:ring-yellow-500"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full bg-yellow-500 text-white hover:bg-yellow-600 px-6 py-3 rounded-full font-semibold text-lg">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
