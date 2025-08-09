/**
 * Test script for UPI payment integration
 * This script tests the basic functionality of UPI payments
 * 
 * Usage: node test-upi-payment.js
 */

const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api';

// Test configuration
const TEST_CONFIG = {
  // You need to create a test user and get a valid JWT token first
  authToken: 'your_jwt_token_here',
  orderId: 'your_order_id_here'
};

// Test functions
async function testCreateRazorpayOrder() {
  try {
    console.log('Testing Razorpay order creation...');
    
    const response = await axios.post(
      `${BASE_URL}/payments/create-razorpay-order`,
      { orderId: TEST_CONFIG.orderId },
      {
        headers: {
          'Authorization': `Bearer ${TEST_CONFIG.authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Razorpay order created:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error.response?.data || error.message);
  }
}

async function testCreateUPIPayment() {
  try {
    console.log('Testing UPI payment creation...');
    
    const response = await axios.post(
      `${BASE_URL}/payments/create-upi-payment`,
      {
        orderId: TEST_CONFIG.orderId,
        upiId: 'test@paytm'
      },
      {
        headers: {
          'Authorization': `Bearer ${TEST_CONFIG.authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ UPI payment created:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error creating UPI payment:', error.response?.data || error.message);
  }
}

async function testPaymentStatus(paymentId) {
  try {
    console.log('Testing payment status fetch...');
    
    const response = await axios.get(
      `${BASE_URL}/payments/status/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${TEST_CONFIG.authToken}`
        }
      }
    );
    
    console.log('✅ Payment status:', response.data);
  } catch (error) {
    console.error('❌ Error fetching payment status:', error.response?.data || error.message);
  }
}

// Configuration check
function checkConfiguration() {
  const requiredEnvVars = [
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars);
    console.log('Please set these in your .env file:');
    missingVars.forEach(varName => {
      console.log(`${varName}=your_value_here`);
    });
    return false;
  }
  
  if (TEST_CONFIG.authToken === 'your_jwt_token_here') {
    console.error('❌ Please update TEST_CONFIG.authToken with a valid JWT token');
    return false;
  }
  
  if (TEST_CONFIG.orderId === 'your_order_id_here') {
    console.error('❌ Please update TEST_CONFIG.orderId with a valid order ID');
    return false;
  }
  
  console.log('✅ Configuration looks good!');
  return true;
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting UPI Payment Integration Tests\n');
  
  if (!checkConfiguration()) {
    console.log('\n❌ Configuration issues found. Please fix them before running tests.');
    return;
  }
  
  console.log('\n--- Running Tests ---\n');
  
  // Test 1: Create Razorpay order
  const razorpayOrder = await testCreateRazorpayOrder();
  
  console.log('\n');
  
  // Test 2: Create UPI payment
  const upiPayment = await testCreateUPIPayment();
  
  console.log('\n');
  
  // Test 3: Check payment status (if we have a payment ID)
  // Note: In real testing, you'd get a payment ID from successful payment
  // await testPaymentStatus('pay_test_123456789');
  
  console.log('\n✅ Tests completed!');
  
  if (razorpayOrder) {
    console.log('\nNext steps:');
    console.log('1. Use the razorpay_order_id to initiate payment from frontend');
    console.log('2. After payment, verify using /api/payments/verify-razorpay-payment');
    console.log('3. Check order status to confirm payment was processed');
  }
}

// Run the tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testCreateRazorpayOrder,
  testCreateUPIPayment,
  testPaymentStatus
};
