import Link from 'next/link';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiArrowRight,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiHeart,
  FiShield,
  FiTruck,
  FiHeadphones,
  FiClock
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'OUR STORES': [
      { name: 'New York', href: '#' },
      { name: 'London SF', href: '#' },
      { name: 'Cockfosters BP', href: '#' },
      { name: 'Los Angeles', href: '#' },
      { name: 'Chicago', href: '#' },
      { name: 'Las Vegas', href: '#' }
    ],
    'USEFUL LINKS': [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Returns', href: '/returns' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Latest News', href: '/news' },
      { name: 'Our Sitemap', href: '/sitemap' }
    ],
    'FOOTER MENU': [
      { name: 'Instagram profile', href: '#' },
      { name: 'New Collection', href: '#' },
      { name: 'Woman Dress', href: '#' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Latest News', href: '/news' },
      { name: 'Our Sitemap', href: '/sitemap' }
    ],
    'CUSTOMER SERVICE': [
      { name: 'About Us', href: '/about' },
      { name: 'Delivery Information', href: '/delivery' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Returns', href: '/returns' },
      { name: 'Gift Certificates', href: '/gift-cards' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: FiFacebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: FiTwitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: FiInstagram, href: '#', color: 'hover:text-pink-600' },
    { name: 'YouTube', icon: FiYoutube, href: '#', color: 'hover:text-red-600' },
    { name: 'LinkedIn', icon: FiLinkedin, href: '#', color: 'hover:text-blue-700' }
  ];

  const features = [
    {
      icon: FiTruck,
      title: 'FREE SHIPPING',
      description: 'Carrier information'
    },
    {
      icon: FiShield,
      title: 'ONLINE PAYMENT',
      description: 'Payment methods'
    },
    {
      icon: FiHeadphones,
      title: '24/7 SUPPORT',
      description: 'Unlimited help desk'
    },
    {
      icon: FiClock,
      title: '100% SAFE',
      description: 'View our benefits'
    }
  ];

  return (
    <footer className="footer-nexkartin">
      {/* Features Section */}
      <section className="section-nexkartin-sm bg-gray-800">
        <div className="container-nexkartin">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="text-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <section className="section-nexkartin">
        <div className="container-nexkartin">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-nexkartin rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">NexiCart</h3>
                  <p className="text-sm text-gray-400">Premium Shopping</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                Your trusted destination for quality products and exceptional shopping experiences.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FiMapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">451 Wall Street, UK, London</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiPhone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">(064) 332-1233</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiMail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">info@nexicart.com</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-lg font-semibold text-white mb-6">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                      >
                        <FiArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="border-t border-gray-800">
        <div className="container-nexkartin">
          <div className="py-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Join Our Newsletter Now</h3>
              <p className="text-gray-400 mb-6">
                Be the First to Know. Sign up to newsletter today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="btn-nexkartin btn-nexkartin-primary">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <section className="border-t border-gray-800">
        <div className="container-nexkartin">
          <div className="py-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="text-sm text-gray-400">
                Based on <strong>WoodMart</strong> theme 2024 <strong>WooCommerce Themes</strong>.
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className={`text-gray-400 ${social.color} transition-colors duration-200`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
              
              {/* Payment Methods */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">payments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copyright */}
      <section className="border-t border-gray-800">
        <div className="container-nexkartin">
          <div className="py-4 text-center">
            <p className="text-sm text-gray-400">
              © {currentYear} NexiCart. All rights reserved. Made with{' '}
              <FiHeart className="inline w-4 h-4 text-red-500" /> by our team.
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
