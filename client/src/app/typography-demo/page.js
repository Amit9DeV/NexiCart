'use client';

import { Button } from '@/components/ui/Button';

export default function TypographyDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="hero-title mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
            Modern Typography System
          </h1>
          <p className="hero-subtitle max-w-3xl mx-auto text-slate-600">
            A comprehensive typography system inspired by modern design principles, featuring Roboto Slab with carefully crafted type scales and spacing.
          </p>
        </div>

        {/* Display Typography */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="h2 mb-4 text-slate-900">Display Typography</h2>
            <p className="body-large text-slate-600">Large, impactful headlines for hero sections</p>
          </div>
          <div className="grid gap-8">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 text-white shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <h1 className="display-large mb-4 relative z-10">Display Large</h1>
              <p className="caption text-slate-300 relative z-10">Font: Roboto Slab, Weight: 900, Size: 8rem</p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-blue-800 p-8 text-white shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <h2 className="display-medium mb-4 relative z-10">Display Medium</h2>
              <p className="caption text-slate-300 relative z-10">Font: Roboto Slab, Weight: 800, Size: 6rem</p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 to-blue-700 p-8 text-white shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <h3 className="display-small mb-4 relative z-10">Display Small</h3>
              <p className="caption text-slate-300 relative z-10">Font: Roboto Slab, Weight: 700, Size: 4.5rem</p>
            </div>
          </div>
        </div>

        {/* Heading Hierarchy */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="h2 mb-4 text-slate-900">Heading Hierarchy</h2>
            <p className="body-large text-slate-600">Semantic heading structure with consistent spacing</p>
          </div>
          <div className="grid gap-6">
            {[
              { level: 'h1', class: 'h1', weight: '800', size: '3rem' },
              { level: 'h2', class: 'h2', weight: '700', size: '2.25rem' },
              { level: 'h3', class: 'h3', weight: '600', size: '1.875rem' },
              { level: 'h4', class: 'h4', weight: '600', size: '1.5rem' },
              { level: 'h5', class: 'h5', weight: '500', size: '1.25rem' },
              { level: 'h6', class: 'h6', weight: '500', size: '1.125rem' }
            ].map((heading, index) => (
              <div key={heading.level} className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:scale-[1.01]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className={`${heading.class} mb-2 text-slate-900`}>
                    {heading.level.toUpperCase()} - {heading.level === 'h1' ? 'Heading 1' : heading.level === 'h2' ? 'Heading 2' : heading.level === 'h3' ? 'Heading 3' : heading.level === 'h4' ? 'Heading 4' : heading.level === 'h5' ? 'Heading 5' : 'Heading 6'}
                  </div>
                  <p className="caption text-slate-500">Font: Roboto Slab, Weight: {heading.weight}, Size: {heading.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Body Text */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="h2 mb-4 text-slate-900">Body Text</h2>
            <p className="body-large text-slate-600">Different body text styles for various content types</p>
          </div>
          <div className="grid gap-6">
            {[
              { class: 'body-large', desc: 'Lead paragraphs and important content', weight: '400', size: '1.125rem' },
              { class: 'body', desc: 'Standard paragraph text for most content', weight: '400', size: '1rem' },
              { class: 'body-small', desc: 'Secondary information and captions', weight: '400', size: '0.875rem' },
              { class: 'caption', desc: 'Metadata, timestamps, and supplementary info', weight: '400', size: '0.75rem' }
            ].map((text, index) => (
              <div key={text.class} className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:scale-[1.01]">
                <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-emerald-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <p className={`${text.class} mb-3 text-slate-700`}>
                    This is {text.class.replace('-', ' ')}. {text.desc}. It has comfortable line height and spacing for optimal readability across different screen sizes and contexts.
                  </p>
                  <p className="caption text-slate-500">Font: Roboto Slab, Weight: {text.weight}, Size: {text.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UI Typography */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="h2 mb-4 text-slate-900">UI Typography</h2>
            <p className="body-large text-slate-600">Text styles for interactive elements and navigation</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Buttons */}
            <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-pink-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <h3 className="h4 mb-4 text-slate-900">Button Typography</h3>
                <p className="body-small mb-4 text-slate-600">Text styles for interactive elements</p>
                <div className="space-y-3">
                  <Button className="btn-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    Button Text (Small)
                  </Button>
                  <Button className="btn-text-large bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    Button Text (Large)
                  </Button>
                </div>
                <p className="caption mt-4 text-slate-500">Optimized for readability and touch targets</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-amber-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <h3 className="h4 mb-4 text-slate-900">Navigation Typography</h3>
                <p className="body-small mb-4 text-slate-600">Text styles for navigation elements</p>
                <nav className="space-y-3">
                  <a href="#" className="nav-text block text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium">Home</a>
                  <a href="#" className="nav-text block text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium">Products</a>
                  <a href="#" className="nav-text block text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium">About</a>
                  <a href="#" className="nav-text block text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium">Contact</a>
                </nav>
                <p className="caption mt-4 text-slate-500">Consistent spacing and hover states</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Typography */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="h2 mb-4 text-slate-900">Form Typography</h2>
            <p className="body-large text-slate-600">Text styles for form elements and labels</p>
          </div>
          <div className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative z-10 grid md:grid-cols-2 gap-8">
              <div>
                <label className="form-label block mb-3 text-slate-700 font-medium">Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                <p className="form-help mt-2 text-slate-500">We&apos;ll never share your email with anyone else.</p>
              </div>
              <div>
                <label className="form-label block mb-3 text-slate-700 font-medium">Password</label>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                <p className="form-help mt-2 text-slate-500">Must be at least 8 characters long.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Typography */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="h2 mb-4 text-slate-900">Code Typography</h2>
            <p className="body-large text-slate-600">Monospace fonts for code and technical content</p>
          </div>
          <div className="grid gap-6">
            <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-gray-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <p className="code mb-3 text-slate-800 bg-slate-100 px-3 py-2 rounded-md inline-block">const greeting = &quot;Hello, World!&quot;;</p>
                <p className="caption text-slate-500">Regular code text</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-gray-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <p className="code-small mb-3 text-slate-800 bg-slate-100 px-3 py-2 rounded-md inline-block">npm install @next/font</p>
                <p className="caption text-slate-500">Small code text for inline code</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <pre className="code text-green-400 overflow-x-auto">
{`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`}
                </pre>
                <p className="caption mt-3 text-slate-400">Code block with syntax highlighting</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badge Typography */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="h2 mb-4 text-slate-900">Badge Typography</h2>
            <p className="body-large text-slate-600">Text styles for badges and labels</p>
          </div>
          <div className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative z-10">
              <div className="flex flex-wrap gap-4">
                <span className="badge-text bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">New</span>
                <span className="badge-text bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">Success</span>
                <span className="badge-text bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">Warning</span>
                <span className="badge-text bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">Error</span>
              </div>
              <p className="caption mt-4 text-slate-500">Uppercase, condensed letter spacing for badges</p>
            </div>
          </div>
        </div>

        {/* Responsive Typography */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="h2 mb-4 text-slate-900">Responsive Typography</h2>
            <p className="body-large text-slate-600">Typography that scales with screen size</p>
          </div>
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 text-white shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            <div className="relative z-10">
              <h1 className="hero-title mb-6">Responsive Hero Title</h1>
              <p className="caption mb-4 text-slate-300">This title scales from 2.5rem to 4.5rem based on viewport width</p>
              <p className="hero-subtitle mb-4 text-slate-300">
                This subtitle also scales responsively, ensuring optimal readability across all devices.
              </p>
              <p className="caption text-slate-400">Scales from 1.125rem to 1.5rem</p>
            </div>
          </div>
        </div>

        {/* Font Features */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="h2 mb-4 text-slate-900">Font Features</h2>
            <p className="body-large text-slate-600">Advanced typography features for better readability</p>
          </div>
          <div className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-50/50 to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative z-10 space-y-6">
              <div>
                <h3 className="h3 mb-4 text-slate-900">Ligatures & Contextual Alternates</h3>
                <p className="body-large text-slate-700">
                  The Roboto Slab font includes advanced OpenType features like ligatures and contextual alternates for improved readability and visual appeal.
                </p>
              </div>
              <div>
                <h3 className="h3 mb-4 text-slate-900">Monospace Features</h3>
                <p className="code text-slate-800 bg-slate-100 px-4 py-3 rounded-lg inline-block">
                  JetBrains Mono includes programming ligatures for common code sequences.
                </p>
              </div>
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-4 rounded-lg">
                <p className="caption text-slate-600">
                  <strong>Font Features Enabled:</strong> cv02, cv03, cv04, cv11 (Roboto Slab) | liga, calt (JetBrains Mono)
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 