const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

console.log('Starting route loading test...');

// Test each route file individually
const routeFiles = [
  'authRoutes',
  'productRoutes', 
  'orderRoutes',
  'userRoutes',
  'reviewRoutes',
  'cartRoutes',
  'adminRoutes'
];

for (const routeFile of routeFiles) {
  try {
    console.log(`Loading ${routeFile}...`);
    const routes = require(`./routes/${routeFile}`);
    app.use(`/api/test-${routeFile}`, routes);
    console.log(`✅ ${routeFile} loaded successfully`);
  } catch (error) {
    console.error(`❌ Error loading ${routeFile}:`, error.message);
    console.error('Stack:', error.stack);
    break;
  }
}

console.log('Route loading test completed');
