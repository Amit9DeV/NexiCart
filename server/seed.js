const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

dotenv.config();

// Sample users data
const users = [
  {
    name: 'Admin User',
    email: 'admin@nexicart.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1-555-0100',
    addresses: [{
      type: 'work',
      street: '123 Admin Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      isDefault: true
    }]
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    phone: '+1-555-0101',
    addresses: [{
      type: 'home',
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
      isDefault: true
    }]
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    phone: '+1-555-0102',
    addresses: [{
      type: 'home',
      street: '789 Pine Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      isDefault: true
    }]
  }
];

// Comprehensive products data
const products = [
  // Electronics
  {
    name: 'iPhone 15 Pro Max',
    description: 'The most advanced iPhone ever with titanium design, A17 Pro chip, and revolutionary camera system.',
    price: 1199.99,
    discountPrice: 1099.99,
    category: 'Electronics',
    brand: 'Apple',
    stock: 50,
    images: [{ url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', alt: 'iPhone 15 Pro Max' }],
    features: ['A17 Pro chip', '6.7-inch Super Retina XDR display', 'Pro camera system', '5G connectivity'],
    specifications: {
      'Display': '6.7-inch Super Retina XDR',
      'Chip': 'A17 Pro',
      'Storage': '256GB',
      'Camera': '48MP Main, 12MP Ultra Wide'
    },
    tags: ['smartphone', 'apple', 'mobile', 'premium'],
    isFeatured: true,
    ratings: { average: 4.8, count: 125 }
  },
  {
    name: 'Samsung 65" 4K Smart TV',
    description: 'Crystal clear 4K resolution with smart features and HDR support for an immersive viewing experience.',
    price: 899.99,
    discountPrice: 799.99,
    category: 'Electronics',
    brand: 'Samsung',
    stock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500', alt: 'Samsung 4K TV' }],
    features: ['4K UHD resolution', 'Smart TV platform', 'HDR support', 'Voice control'],
    specifications: {
      'Screen Size': '65 inches',
      'Resolution': '4K UHD (3840 x 2160)',
      'Smart Platform': 'Tizen OS',
      'HDR': 'HDR10+'
    },
    tags: ['tv', 'smart tv', '4k', 'samsung'],
    isFeatured: true,
    ratings: { average: 4.6, count: 89 }
  },
  {
    name: 'MacBook Air M2',
    description: 'Supercharged by the M2 chip, this laptop delivers exceptional performance and all-day battery life.',
    price: 1299.99,
    category: 'Electronics',
    brand: 'Apple',
    stock: 40,
    images: [{ url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500', alt: 'MacBook Air' }],
    features: ['M2 chip', '13.6-inch Liquid Retina display', '18-hour battery life', 'MagSafe charging'],
    specifications: {
      'Processor': 'Apple M2 chip',
      'Memory': '8GB unified memory',
      'Storage': '256GB SSD',
      'Display': '13.6-inch Liquid Retina'
    },
    tags: ['laptop', 'apple', 'macbook', 'productivity'],
    isFeatured: true,
    ratings: { average: 4.9, count: 156 }
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling with exceptional sound quality and all-day comfort.',
    price: 399.99,
    discountPrice: 349.99,
    category: 'Electronics',
    brand: 'Sony',
    stock: 75,
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', alt: 'Sony Headphones' }],
    features: ['Industry-leading noise canceling', '30-hour battery life', 'Multipoint connection', 'Quick charge'],
    specifications: {
      'Battery Life': '30 hours',
      'Noise Canceling': 'Active',
      'Connectivity': 'Bluetooth 5.2',
      'Weight': '250g'
    },
    tags: ['headphones', 'sony', 'wireless', 'noise-canceling'],
    ratings: { average: 4.7, count: 234 }
  },

  // Clothing
  {
    name: 'Premium Cotton Hoodie',
    description: 'Comfortable and stylish hoodie made from premium organic cotton. Perfect for casual wear.',
    price: 79.99,
    discountPrice: 59.99,
    category: 'Clothing',
    brand: 'UrbanStyle',
    stock: 150,
    images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', alt: 'Cotton Hoodie' }],
    features: ['100% organic cotton', 'Comfortable fit', 'Machine washable', 'Multiple colors'],
    specifications: {
      'Material': '100% Organic Cotton',
      'Fit': 'Regular',
      'Care': 'Machine wash cold',
      'Origin': 'Made in USA'
    },
    tags: ['hoodie', 'cotton', 'casual', 'organic'],
    ratings: { average: 4.4, count: 67 }
  },
  {
    name: 'Designer Denim Jeans',
    description: 'Premium quality denim jeans with a perfect fit and contemporary style.',
    price: 129.99,
    discountPrice: 99.99,
    category: 'Clothing',
    brand: 'DenimCraft',
    stock: 100,
    images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', alt: 'Denim Jeans' }],
    features: ['Premium denim', 'Slim fit', 'Stretch comfort', 'Fade resistant'],
    specifications: {
      'Material': '98% Cotton, 2% Elastane',
      'Fit': 'Slim',
      'Rise': 'Mid-rise',
      'Length': 'Regular'
    },
    tags: ['jeans', 'denim', 'fashion', 'casual'],
    ratings: { average: 4.3, count: 92 }
  },

  // Books
  {
    name: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.',
    price: 16.99,
    category: 'Books',
    brand: 'Harriman House',
    stock: 200,
    images: [{ url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', alt: 'Psychology of Money Book' }],
    features: ['Bestseller', 'Financial wisdom', 'Easy to read', 'Practical insights'],
    specifications: {
      'Pages': '256',
      'Language': 'English',
      'Publisher': 'Harriman House',
      'ISBN': '978-0857197689'
    },
    tags: ['finance', 'psychology', 'money', 'bestseller'],
    isFeatured: true,
    ratings: { average: 4.8, count: 312 }
  },
  {
    name: 'Atomic Habits',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear.',
    price: 18.99,
    category: 'Books',
    brand: 'Avery',
    stock: 180,
    images: [{ url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500', alt: 'Atomic Habits Book' }],
    features: ['Self-improvement', 'Habit formation', 'Practical strategies', 'Scientific approach'],
    specifications: {
      'Pages': '320',
      'Language': 'English',
      'Publisher': 'Avery',
      'ISBN': '978-0735211292'
    },
    tags: ['habits', 'self-improvement', 'productivity', 'bestseller'],
    isFeatured: true,
    ratings: { average: 4.9, count: 445 }
  },

  // Home & Garden
  {
    name: 'Robot Vacuum Cleaner',
    description: 'Smart robot vacuum with mapping technology and app control for effortless cleaning.',
    price: 299.99,
    discountPrice: 249.99,
    category: 'Home & Garden',
    brand: 'CleanBot',
    stock: 60,
    images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', alt: 'Robot Vacuum' }],
    features: ['Smart mapping', 'App control', 'Auto-charging', 'HEPA filter'],
    specifications: {
      'Battery Life': '120 minutes',
      'Suction Power': '2000Pa',
      'Dustbin Capacity': '0.6L',
      'Navigation': 'LiDAR'
    },
    tags: ['vacuum', 'robot', 'smart home', 'cleaning'],
    ratings: { average: 4.5, count: 128 }
  },
  {
    name: 'Air Fryer 6-Quart',
    description: 'Large capacity air fryer for healthy cooking with little to no oil.',
    price: 149.99,
    discountPrice: 119.99,
    category: 'Home & Garden',
    brand: 'HealthyCook',
    stock: 80,
    images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', alt: 'Air Fryer' }],
    features: ['6-quart capacity', '8 preset programs', 'Digital touchscreen', 'Dishwasher safe'],
    specifications: {
      'Capacity': '6 quarts',
      'Power': '1700 watts',
      'Temperature Range': '180°F - 400°F',
      'Timer': '60 minutes'
    },
    tags: ['air fryer', 'kitchen', 'healthy cooking', 'appliance'],
    ratings: { average: 4.6, count: 189 }
  },

  // Sports
  {
    name: 'Professional Yoga Mat',
    description: 'Premium non-slip yoga mat made from eco-friendly materials.',
    price: 49.99,
    category: 'Sports',
    brand: 'ZenFlow',
    stock: 120,
    images: [{ url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', alt: 'Yoga Mat' }],
    features: ['Non-slip surface', 'Eco-friendly', '6mm thickness', 'Carrying strap included'],
    specifications: {
      'Dimensions': '72" x 24"',
      'Thickness': '6mm',
      'Material': 'TPE (Thermoplastic Elastomer)',
      'Weight': '2.5 lbs'
    },
    tags: ['yoga', 'fitness', 'mat', 'exercise'],
    ratings: { average: 4.7, count: 156 }
  },
  {
    name: 'Adjustable Dumbbells Set',
    description: 'Space-saving adjustable dumbbells that replace 15 sets of weights.',
    price: 399.99,
    discountPrice: 349.99,
    category: 'Sports',
    brand: 'FitPro',
    stock: 45,
    images: [{ url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', alt: 'Adjustable Dumbbells' }],
    features: ['5-50 lbs per dumbbell', 'Quick weight adjustment', 'Space efficient', 'Durable construction'],
    specifications: {
      'Weight Range': '5-50 lbs per dumbbell',
      'Adjustment': 'Dial system',
      'Material': 'Steel and rubber',
      'Warranty': '2 years'
    },
    tags: ['dumbbells', 'weights', 'fitness', 'home gym'],
    ratings: { average: 4.5, count: 78 }
  },

  // Beauty
  {
    name: 'Anti-Aging Skincare Set',
    description: 'Complete anti-aging skincare routine with cleanser, serum, and moisturizer.',
    price: 89.99,
    discountPrice: 69.99,
    category: 'Beauty',
    brand: 'GlowUp',
    stock: 90,
    images: [{ url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', alt: 'Skincare Set' }],
    features: ['3-step routine', 'Anti-aging formula', 'Natural ingredients', 'Suitable for all skin types'],
    specifications: {
      'Set Includes': 'Cleanser, Serum, Moisturizer',
      'Skin Type': 'All skin types',
      'Key Ingredients': 'Retinol, Hyaluronic Acid, Vitamin C',
      'Volume': '50ml each'
    },
    tags: ['skincare', 'anti-aging', 'beauty', 'routine'],
    ratings: { average: 4.4, count: 134 }
  },

  // Toys
  {
    name: 'STEM Learning Kit for Kids',
    description: 'Educational STEM kit that combines fun and learning for children aged 8-14.',
    price: 79.99,
    discountPrice: 59.99,
    category: 'Toys',
    brand: 'EduTech',
    stock: 70,
    images: [{ url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', alt: 'STEM Kit' }],
    features: ['20+ experiments', 'Step-by-step guide', 'Safe materials', 'Educational value'],
    specifications: {
      'Age Range': '8-14 years',
      'Experiments': '20+',
      'Materials': 'Non-toxic',
      'Guide': 'Illustrated manual'
    },
    tags: ['stem', 'education', 'kids', 'learning'],
    ratings: { average: 4.8, count: 95 }
  },

  // Automotive
  {
    name: 'Car Phone Mount',
    description: 'Universal car phone mount with 360-degree rotation and strong magnetic hold.',
    price: 24.99,
    discountPrice: 19.99,
    category: 'Automotive',
    brand: 'DriveEasy',
    stock: 200,
    images: [{ url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500', alt: 'Car Phone Mount' }],
    features: ['360-degree rotation', 'Strong magnetic hold', 'Universal compatibility', 'Easy installation'],
    specifications: {
      'Compatibility': 'All smartphones',
      'Mount Type': 'Magnetic',
      'Installation': 'Dashboard/Windshield',
      'Material': 'ABS plastic and silicone'
    },
    tags: ['car accessories', 'phone mount', 'automotive', 'universal'],
    ratings: { average: 4.3, count: 67 }
  },

  // Health
  {
    name: 'Digital Blood Pressure Monitor',
    description: 'FDA-approved digital blood pressure monitor with large display and memory function.',
    price: 49.99,
    category: 'Health',
    brand: 'HealthTech',
    stock: 85,
    images: [{ url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500', alt: 'Blood Pressure Monitor' }],
    features: ['FDA approved', 'Large LCD display', '120 memory storage', 'Irregular heartbeat detection'],
    specifications: {
      'Accuracy': '±3 mmHg',
      'Memory': '120 readings',
      'Cuff Size': '22-42 cm',
      'Power': '4 AA batteries'
    },
    tags: ['health', 'blood pressure', 'medical', 'monitor'],
    ratings: { average: 4.6, count: 112 }
  },

  // Food
  {
    name: 'Organic Green Tea Set',
    description: 'Premium organic green tea collection with 6 different flavors.',
    price: 34.99,
    discountPrice: 29.99,
    category: 'Food',
    brand: 'TeaHouse',
    stock: 150,
    images: [{ url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500', alt: 'Green Tea Set' }],
    features: ['100% organic', '6 flavor varieties', 'Antioxidant rich', 'Premium quality'],
    specifications: {
      'Weight': '200g total',
      'Varieties': '6 different flavors',
      'Origin': 'Certified organic farms',
      'Shelf Life': '2 years'
    },
    tags: ['tea', 'organic', 'green tea', 'healthy'],
    ratings: { average: 4.7, count: 89 }
  },

  // Additional Electronics
  {
    name: 'iPad Air 5th Generation',
    description: 'Powerful iPad Air with M1 chip, 10.9-inch Liquid Retina display, and all-day battery life.',
    price: 599.99,
    discountPrice: 549.99,
    category: 'Electronics',
    brand: 'Apple',
    stock: 65,
    images: [{ url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', alt: 'iPad Air' }],
    features: ['M1 chip', '10.9-inch display', '5G capable', 'Apple Pencil support'],
    specifications: {
      'Display': '10.9-inch Liquid Retina',
      'Chip': 'Apple M1',
      'Storage': '64GB',
      'Battery': 'Up to 10 hours'
    },
    tags: ['ipad', 'tablet', 'apple', 'mobile'],
    ratings: { average: 4.8, count: 203 }
  },
  {
    name: 'DJI Mini 3 Pro Drone',
    description: 'Ultralight camera drone with 4K video, 48MP photos, and 34-minute flight time.',
    price: 759.99,
    category: 'Electronics',
    brand: 'DJI',
    stock: 30,
    images: [{ url: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=500', alt: 'DJI Drone' }],
    features: ['4K video', '48MP photos', '34-min flight time', 'Obstacle avoidance'],
    specifications: {
      'Weight': '249g',
      'Camera': '1/1.3-inch CMOS',
      'Video': '4K/30fps',
      'Flight Time': '34 minutes'
    },
    tags: ['drone', 'camera', 'aerial', 'photography'],
    isFeatured: true,
    ratings: { average: 4.9, count: 167 }
  },
  {
    name: 'Nintendo Switch OLED',
    description: 'Nintendo Switch with vibrant 7-inch OLED screen and enhanced audio.',
    price: 349.99,
    category: 'Electronics',
    brand: 'Nintendo',
    stock: 45,
    images: [{ url: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500', alt: 'Nintendo Switch' }],
    features: ['7-inch OLED screen', 'Enhanced audio', '64GB storage', 'Tabletop mode'],
    specifications: {
      'Screen': '7-inch OLED',
      'Storage': '64GB',
      'Battery': '4.5-9 hours',
      'Resolution': '1280x720'
    },
    tags: ['gaming', 'nintendo', 'switch', 'console'],
    ratings: { average: 4.7, count: 298 }
  },

  // Additional Clothing
  {
    name: 'Wireless Sports Bra',
    description: 'High-performance wireless sports bra with moisture-wicking technology.',
    price: 45.99,
    discountPrice: 39.99,
    category: 'Clothing',
    brand: 'FitWear',
    stock: 120,
    images: [{ url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', alt: 'Sports Bra' }],
    features: ['Wireless design', 'Moisture-wicking', 'High impact support', 'Breathable fabric'],
    specifications: {
      'Material': '85% Polyester, 15% Spandex',
      'Support': 'High impact',
      'Care': 'Machine wash cold',
      'Sizes': 'XS-XXL'
    },
    tags: ['sports bra', 'fitness', 'athletic', 'wireless'],
    ratings: { average: 4.5, count: 156 }
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Premium leather crossbody bag with adjustable strap and multiple compartments.',
    price: 89.99,
    category: 'Clothing',
    brand: 'LeatherCraft',
    stock: 80,
    images: [{ url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', alt: 'Leather Bag' }],
    features: ['Genuine leather', 'Adjustable strap', 'Multiple compartments', 'Water resistant'],
    specifications: {
      'Material': 'Genuine leather',
      'Dimensions': '10" x 7" x 2"',
      'Strap Length': 'Adjustable 20-28"',
      'Weight': '1.2 lbs'
    },
    tags: ['bag', 'leather', 'crossbody', 'accessories'],
    ratings: { average: 4.6, count: 89 }
  },

  // Additional Books
  {
    name: 'Rich Dad Poor Dad',
    description: 'What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!',
    price: 15.99,
    category: 'Books',
    brand: 'Plata Publishing',
    stock: 250,
    images: [{ url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500', alt: 'Rich Dad Poor Dad' }],
    features: ['Financial education', 'Bestseller', 'Easy to understand', 'Life-changing insights'],
    specifications: {
      'Pages': '336',
      'Language': 'English',
      'Publisher': 'Plata Publishing',
      'ISBN': '978-1612680194'
    },
    tags: ['finance', 'education', 'money', 'bestseller'],
    ratings: { average: 4.6, count: 567 }
  },
  {
    name: 'The 7 Habits of Highly Effective People',
    description: 'Powerful Lessons in Personal Change by Stephen R. Covey.',
    price: 19.99,
    category: 'Books',
    brand: 'Simon & Schuster',
    stock: 180,
    images: [{ url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500', alt: '7 Habits Book' }],
    features: ['Personal development', 'Leadership', 'Time management', 'Proactive approach'],
    specifications: {
      'Pages': '432',
      'Language': 'English',
      'Publisher': 'Simon & Schuster',
      'ISBN': '978-0743269513'
    },
    tags: ['self-help', 'leadership', 'productivity', 'classic'],
    ratings: { average: 4.7, count: 423 }
  },

  // Additional Home & Garden
  {
    name: 'Smart LED Light Bulbs Pack',
    description: 'WiFi-enabled smart LED bulbs with voice control and 16 million colors.',
    price: 49.99,
    discountPrice: 39.99,
    category: 'Home & Garden',
    brand: 'SmartHome',
    stock: 100,
    images: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', alt: 'Smart Bulbs' }],
    features: ['WiFi enabled', 'Voice control', '16M colors', 'Energy efficient'],
    specifications: {
      'Wattage': '9W (60W equivalent)',
      'Lumens': '800',
      'Color Temperature': '2700K-6500K',
      'Lifespan': '25,000 hours'
    },
    tags: ['smart home', 'led bulbs', 'wifi', 'voice control'],
    ratings: { average: 4.4, count: 178 }
  },
  {
    name: 'Garden Tool Set',
    description: 'Complete garden tool set with ergonomic handles and rust-resistant coating.',
    price: 79.99,
    category: 'Home & Garden',
    brand: 'GardenPro',
    stock: 60,
    images: [{ url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500', alt: 'Garden Tools' }],
    features: ['8-piece set', 'Ergonomic handles', 'Rust-resistant', 'Storage bag included'],
    specifications: {
      'Pieces': '8 tools',
      'Material': 'Stainless steel',
      'Handle': 'Ergonomic rubber',
      'Warranty': '5 years'
    },
    tags: ['garden', 'tools', 'outdoor', 'gardening'],
    ratings: { average: 4.6, count: 134 }
  },

  // Additional Sports
  {
    name: 'Fitness Tracker Smartwatch',
    description: 'Advanced fitness tracker with heart rate monitoring and GPS tracking.',
    price: 199.99,
    discountPrice: 179.99,
    category: 'Sports',
    brand: 'FitTech',
    stock: 75,
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', alt: 'Fitness Tracker' }],
    features: ['Heart rate monitor', 'GPS tracking', '7-day battery', 'Water resistant'],
    specifications: {
      'Battery Life': '7 days',
      'Water Resistance': '5ATM',
      'Display': '1.4-inch AMOLED',
      'Sensors': 'Heart rate, GPS, Accelerometer'
    },
    tags: ['fitness tracker', 'smartwatch', 'health', 'monitoring'],
    ratings: { average: 4.5, count: 267 }
  },
  {
    name: 'Basketball Hoop & Backboard',
    description: 'Adjustable basketball hoop with breakaway rim and weather-resistant backboard.',
    price: 299.99,
    category: 'Sports',
    brand: 'SportMaster',
    stock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500', alt: 'Basketball Hoop' }],
    features: ['Adjustable height', 'Breakaway rim', 'Weather resistant', 'Easy assembly'],
    specifications: {
      'Height Range': '7.5-10 feet',
      'Backboard': '44-inch polycarbonate',
      'Rim': 'Breakaway',
      'Pole': '4-inch steel'
    },
    tags: ['basketball', 'hoop', 'outdoor', 'sports'],
    ratings: { average: 4.7, count: 89 }
  },

  // Additional Beauty
  {
    name: 'Professional Hair Dryer',
    description: 'Ionic hair dryer with multiple heat settings and concentrator attachment.',
    price: 129.99,
    discountPrice: 109.99,
    category: 'Beauty',
    brand: 'BeautyPro',
    stock: 85,
    images: [{ url: 'https://images.unsplash.com/photo-1522338140263-f46f5913618a?w=500', alt: 'Hair Dryer' }],
    features: ['Ionic technology', '3 heat settings', '2 speed settings', 'Concentrator included'],
    specifications: {
      'Power': '1875 watts',
      'Heat Settings': '3',
      'Speed Settings': '2',
      'Weight': '1.8 lbs'
    },
    tags: ['hair dryer', 'ionic', 'professional', 'styling'],
    ratings: { average: 4.6, count: 198 }
  },
  {
    name: 'Makeup Brush Set',
    description: 'Professional makeup brush set with synthetic bristles and travel case.',
    price: 39.99,
    category: 'Beauty',
    brand: 'BeautyTools',
    stock: 150,
    images: [{ url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500', alt: 'Makeup Brushes' }],
    features: ['12-piece set', 'Synthetic bristles', 'Travel case', 'Professional quality'],
    specifications: {
      'Brushes': '12 pieces',
      'Bristles': 'Synthetic',
      'Case': 'Travel-friendly',
      'Cleaning': 'Easy to clean'
    },
    tags: ['makeup', 'brushes', 'professional', 'beauty'],
    ratings: { average: 4.4, count: 234 }
  },

  // Additional Toys
  {
    name: 'Remote Control Car',
    description: 'High-speed RC car with 4WD and rechargeable battery for outdoor fun.',
    price: 89.99,
    discountPrice: 69.99,
    category: 'Toys',
    brand: 'SpeedRacer',
    stock: 55,
    images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', alt: 'RC Car' }],
    features: ['4WD system', 'Rechargeable battery', 'High speed', 'Durable construction'],
    specifications: {
      'Speed': 'Up to 25 mph',
      'Battery': '7.4V 2000mAh',
      'Control Range': '100 meters',
      'Age': '8+ years'
    },
    tags: ['rc car', 'remote control', 'toy', 'outdoor'],
    ratings: { average: 4.5, count: 123 }
  },
  {
    name: 'Building Blocks Set',
    description: 'Creative building blocks set with 500+ pieces for endless construction fun.',
    price: 59.99,
    category: 'Toys',
    brand: 'BuildMaster',
    stock: 90,
    images: [{ url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', alt: 'Building Blocks' }],
    features: ['500+ pieces', 'Compatible design', 'Storage box', 'Instruction manual'],
    specifications: {
      'Pieces': '500+',
      'Age Range': '4-12 years',
      'Material': 'ABS plastic',
      'Storage': 'Included box'
    },
    tags: ['building blocks', 'construction', 'creative', 'educational'],
    ratings: { average: 4.8, count: 167 }
  },

  // Additional Automotive
  {
    name: 'Car Jump Starter',
    description: 'Portable car jump starter with USB charging and LED flashlight.',
    price: 79.99,
    category: 'Automotive',
    brand: 'PowerStart',
    stock: 70,
    images: [{ url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500', alt: 'Jump Starter' }],
    features: ['Portable design', 'USB charging', 'LED flashlight', 'Safety protection'],
    specifications: {
      'Capacity': '10000mAh',
      'Peak Current': '400A',
      'USB Ports': '2',
      'Weight': '1.2 lbs'
    },
    tags: ['jump starter', 'car battery', 'emergency', 'portable'],
    ratings: { average: 4.7, count: 145 }
  },
  {
    name: 'Car Dashboard Camera',
    description: 'HD dash cam with night vision and loop recording for vehicle security.',
    price: 149.99,
    discountPrice: 129.99,
    category: 'Automotive',
    brand: 'DriveCam',
    stock: 45,
    images: [{ url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500', alt: 'Dash Cam' }],
    features: ['1080p HD', 'Night vision', 'Loop recording', 'Motion detection'],
    specifications: {
      'Resolution': '1080p HD',
      'Viewing Angle': '170°',
      'Storage': 'Up to 128GB',
      'Night Vision': 'Yes'
    },
    tags: ['dash cam', 'security', 'recording', 'automotive'],
    ratings: { average: 4.6, count: 189 }
  },

  // Additional Health
  {
    name: 'Smart Scale',
    description: 'Bluetooth smart scale that tracks weight, body fat, and BMI.',
    price: 69.99,
    category: 'Health',
    brand: 'HealthScale',
    stock: 95,
    images: [{ url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500', alt: 'Smart Scale' }],
    features: ['Bluetooth connectivity', 'Body composition', 'App sync', 'Multiple users'],
    specifications: {
      'Max Weight': '400 lbs',
      'Connectivity': 'Bluetooth 4.0',
      'Battery': '4 AAA batteries',
      'Users': 'Up to 8'
    },
    tags: ['scale', 'health', 'bluetooth', 'tracking'],
    ratings: { average: 4.5, count: 234 }
  },
  {
    name: 'Massage Gun',
    description: 'Deep tissue massage gun with 5 speed levels and 4 massage heads.',
    price: 199.99,
    discountPrice: 179.99,
    category: 'Health',
    brand: 'MassagePro',
    stock: 60,
    images: [{ url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500', alt: 'Massage Gun' }],
    features: ['5 speed levels', '4 massage heads', 'Rechargeable', 'Quiet operation'],
    specifications: {
      'Speed Levels': '5',
      'Massage Heads': '4',
      'Battery Life': '3-6 hours',
      'Noise Level': '<60dB'
    },
    tags: ['massage', 'recovery', 'fitness', 'therapy'],
    ratings: { average: 4.8, count: 312 }
  },

  // Additional Food
  {
    name: 'Organic Coffee Beans',
    description: 'Premium organic coffee beans with rich flavor and smooth finish.',
    price: 24.99,
    category: 'Food',
    brand: 'CoffeeCraft',
    stock: 200,
    images: [{ url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500', alt: 'Coffee Beans' }],
    features: ['100% organic', 'Single origin', 'Medium roast', 'Fresh roasted'],
    specifications: {
      'Weight': '1 lb',
      'Roast': 'Medium',
      'Origin': 'Colombia',
      'Flavor': 'Rich and smooth'
    },
    tags: ['coffee', 'organic', 'beans', 'premium'],
    ratings: { average: 4.7, count: 178 }
  },
  {
    name: 'Protein Powder Mix',
    description: 'Whey protein powder with 25g protein per serving and great taste.',
    price: 49.99,
    discountPrice: 44.99,
    category: 'Food',
    brand: 'FitNutrition',
    stock: 120,
    images: [{ url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500', alt: 'Protein Powder' }],
    features: ['25g protein', 'Low sugar', 'Great taste', 'Easy mixing'],
    specifications: {
      'Protein': '25g per serving',
      'Serving Size': '30g',
      'Servings': '30 per container',
      'Flavors': 'Chocolate, Vanilla, Strawberry'
    },
    tags: ['protein', 'nutrition', 'fitness', 'supplement'],
    ratings: { average: 4.6, count: 267 }
  },

  // FURNITURE Category Products
  {
    name: 'Modern Sectional Sofa',
    description: 'Comfortable L-shaped sectional sofa with premium fabric upholstery and sturdy wooden frame.',
    price: 1299.99,
    discountPrice: 1099.99,
    category: 'Furniture',
    brand: 'ComfortLiving',
    stock: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', alt: 'Sectional Sofa' }],
    features: ['L-shaped design', 'Premium fabric', 'Sturdy wooden frame', 'Easy assembly'],
    specifications: {
      'Dimensions': '110" x 85" x 35"',
      'Material': 'Fabric upholstery, wooden frame',
      'Seating Capacity': '5-6 people',
      'Weight': '150 lbs'
    },
    tags: ['sofa', 'sectional', 'living room', 'modern'],
    isFeatured: true,
    ratings: { average: 4.6, count: 89 }
  },
  {
    name: 'Dining Table Set',
    description: '6-piece dining table set with solid wood construction and comfortable padded chairs.',
    price: 899.99,
    discountPrice: 799.99,
    category: 'Furniture',
    brand: 'WoodCraft',
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500', alt: 'Dining Table Set' }],
    features: ['Solid wood construction', '6 chairs included', 'Padded seating', 'Classic design'],
    specifications: {
      'Table Dimensions': '72" x 36" x 30"',
      'Material': 'Solid oak wood',
      'Seating': '6 chairs',
      'Finish': 'Natural oak stain'
    },
    tags: ['dining', 'table', 'chairs', 'wood'],
    ratings: { average: 4.5, count: 156 }
  },
  {
    name: 'Queen Size Bed Frame',
    description: 'Elegant queen size bed frame with upholstered headboard and platform base.',
    price: 649.99,
    category: 'Furniture',
    brand: 'BedMaster',
    stock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500', alt: 'Queen Bed Frame' }],
    features: ['Queen size', 'Upholstered headboard', 'Platform base', 'No box spring needed'],
    specifications: {
      'Size': 'Queen (60" x 80")',
      'Height': '14" platform height',
      'Material': 'Metal frame, fabric headboard',
      'Weight Capacity': '600 lbs'
    },
    tags: ['bed', 'queen', 'bedroom', 'platform'],
    ratings: { average: 4.7, count: 203 }
  },
  {
    name: 'Office Desk Chair',
    description: 'Ergonomic office chair with lumbar support, adjustable height, and breathable mesh back.',
    price: 299.99,
    discountPrice: 249.99,
    category: 'Furniture',
    brand: 'ErgoWork',
    stock: 35,
    images: [{ url: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500', alt: 'Office Chair' }],
    features: ['Ergonomic design', 'Lumbar support', 'Adjustable height', 'Breathable mesh'],
    specifications: {
      'Height Range': '17"-21"',
      'Weight Capacity': '300 lbs',
      'Material': 'Mesh back, fabric seat',
      'Warranty': '5 years'
    },
    tags: ['office', 'chair', 'ergonomic', 'desk'],
    ratings: { average: 4.4, count: 287 }
  },
  {
    name: 'Coffee Table with Storage',
    description: 'Modern coffee table with built-in storage compartment and sleek glass top.',
    price: 399.99,
    category: 'Furniture',
    brand: 'ModernLiving',
    stock: 30,
    images: [{ url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', alt: 'Coffee Table' }],
    features: ['Glass top', 'Built-in storage', 'Modern design', 'Sturdy base'],
    specifications: {
      'Dimensions': '48" x 24" x 18"',
      'Material': 'Tempered glass, engineered wood',
      'Storage': 'Hidden compartment',
      'Style': 'Contemporary'
    },
    tags: ['coffee table', 'storage', 'glass', 'modern'],
    ratings: { average: 4.3, count: 134 }
  },
  {
    name: 'Bookshelf 5-Tier',
    description: 'Tall 5-tier bookshelf with adjustable shelves and modern industrial design.',
    price: 179.99,
    discountPrice: 149.99,
    category: 'Furniture',
    brand: 'ShelfMaster',
    stock: 45,
    images: [{ url: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500', alt: 'Bookshelf' }],
    features: ['5 tiers', 'Adjustable shelves', 'Industrial design', 'Sturdy construction'],
    specifications: {
      'Dimensions': '71" x 31" x 12"',
      'Shelves': '5 adjustable',
      'Material': 'Metal frame, wood shelves',
      'Weight Capacity': '40 lbs per shelf'
    },
    tags: ['bookshelf', 'storage', 'industrial', 'shelving'],
    ratings: { average: 4.5, count: 198 }
  },

  // FASHION Category Products
  {
    name: 'Designer Leather Handbag',
    description: 'Premium leather handbag with gold hardware and multiple compartments for style and function.',
    price: 299.99,
    discountPrice: 249.99,
    category: 'Fashion',
    brand: 'LuxeStyle',
    stock: 40,
    images: [{ url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500', alt: 'Leather Handbag' }],
    features: ['Genuine leather', 'Gold hardware', 'Multiple compartments', 'Adjustable strap'],
    specifications: {
      'Material': '100% genuine leather',
      'Dimensions': '12" x 8" x 5"',
      'Strap': 'Adjustable 22"-26"',
      'Closure': 'Zip closure'
    },
    tags: ['handbag', 'leather', 'designer', 'luxury'],
    isFeatured: true,
    ratings: { average: 4.8, count: 167 }
  },
  {
    name: 'Silk Scarf Collection',
    description: 'Set of 3 premium silk scarves with elegant prints and versatile styling options.',
    price: 89.99,
    discountPrice: 69.99,
    category: 'Fashion',
    brand: 'SilkElegance',
    stock: 60,
    images: [{ url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500', alt: 'Silk Scarves' }],
    features: ['100% silk', '3 different designs', 'Versatile styling', 'Premium quality'],
    specifications: {
      'Material': '100% mulberry silk',
      'Dimensions': '35" x 35" each',
      'Designs': '3 unique patterns',
      'Care': 'Dry clean only'
    },
    tags: ['scarf', 'silk', 'fashion', 'accessory'],
    ratings: { average: 4.6, count: 124 }
  },
  {
    name: 'Statement Jewelry Set',
    description: 'Bold statement jewelry set including necklace, earrings, and bracelet with crystal accents.',
    price: 149.99,
    discountPrice: 119.99,
    category: 'Fashion',
    brand: 'GlamourJewels',
    stock: 75,
    images: [{ url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500', alt: 'Jewelry Set' }],
    features: ['3-piece set', 'Crystal accents', 'Gold-plated', 'Statement design'],
    specifications: {
      'Material': 'Gold-plated alloy, crystals',
      'Set Includes': 'Necklace, earrings, bracelet',
      'Plating': '18k gold',
      'Style': 'Contemporary'
    },
    tags: ['jewelry', 'statement', 'crystal', 'set'],
    ratings: { average: 4.4, count: 189 }
  },
  {
    name: 'Designer Sunglasses',
    description: 'Premium designer sunglasses with UV protection and polarized lenses for style and function.',
    price: 199.99,
    discountPrice: 159.99,
    category: 'Fashion',
    brand: 'VisionLux',
    stock: 85,
    images: [{ url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500', alt: 'Designer Sunglasses' }],
    features: ['Polarized lenses', 'UV protection', 'Designer frames', 'Scratch resistant'],
    specifications: {
      'Lens': 'Polarized, UV400',
      'Frame Material': 'Acetate',
      'Lens Width': '55mm',
      'Protection': '100% UV protection'
    },
    tags: ['sunglasses', 'designer', 'polarized', 'uv'],
    ratings: { average: 4.7, count: 234 }
  },
  {
    name: 'Fashion Watch Collection',
    description: 'Elegant fashion watch with stainless steel band and water-resistant design.',
    price: 129.99,
    discountPrice: 99.99,
    category: 'Fashion',
    brand: 'TimeStyle',
    stock: 95,
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', alt: 'Fashion Watch' }],
    features: ['Stainless steel', 'Water resistant', 'Quartz movement', 'Elegant design'],
    specifications: {
      'Movement': 'Japanese quartz',
      'Water Resistance': '30 meters',
      'Case Diameter': '40mm',
      'Band Material': 'Stainless steel'
    },
    tags: ['watch', 'fashion', 'stainless steel', 'elegant'],
    ratings: { average: 4.5, count: 298 }
  },
  {
    name: 'Luxury Perfume Set',
    description: 'Collection of 4 luxury perfumes with different scent profiles in elegant bottles.',
    price: 199.99,
    discountPrice: 169.99,
    category: 'Fashion',
    brand: 'FragranceLux',
    stock: 50,
    images: [{ url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500', alt: 'Perfume Set' }],
    features: ['4 different scents', 'Long-lasting formula', 'Elegant bottles', 'Gift packaging'],
    specifications: {
      'Volume': '30ml each (4 bottles)',
      'Scent Types': 'Floral, Woody, Fresh, Oriental',
      'Longevity': '6-8 hours',
      'Packaging': 'Premium gift box'
    },
    tags: ['perfume', 'fragrance', 'luxury', 'gift'],
    isFeatured: true,
    ratings: { average: 4.9, count: 156 }
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    
    console.log('Existing data cleared...');
    
    // Create users with hashed passwords
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );
    
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`${createdUsers.length} users created...`);
    
    // Find the admin user
    const adminUser = createdUsers.find(user => user.role === 'admin');
    
    // Create products linked to admin user with generated slugs
    const sampleProducts = products.map(product => {
      const slug = product.name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');
      return { ...product, slug, createdBy: adminUser._id };
    });
    
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`${createdProducts.length} products created...`);
    
    console.log('\n=== DATABASE SEEDED SUCCESSFULLY ===');
    console.log(`Admin User: admin@nexicart.com / admin123`);
    console.log(`Regular Users: john@example.com, jane@example.com / password123`);
    console.log(`Products: ${createdProducts.length} items across multiple categories`);
    console.log('=====================================\n');
    
    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    
    console.log('All data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedDatabase();
}

