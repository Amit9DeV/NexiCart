# UPI Payment Integration with Razorpay

This document explains the UPI payment integration implemented for NexiCart using Razorpay, India's leading payment gateway.

## Overview

The integration supports:
- **UPI payments** (Google Pay, PhonePe, Paytm, BHIM, etc.)
- **Credit/Debit Cards**
- **Net Banking**
- **Wallets**

## Setup Instructions

### 1. Razorpay Account Setup

1. Sign up at [razorpay.com](https://razorpay.com)
2. Complete KYC verification
3. Get your API credentials:
   - Key ID
   - Key Secret

### 2. Environment Configuration

Add these variables to your `.env` file:

```env
RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_KEY_SECRET=your_secret_key_here
UPI_MERCHANT_ID=your_merchant@upi
```

### 3. Dependencies

The following package has been added:
```bash
npm install razorpay
```

## API Endpoints

### 1. Create Razorpay Order
**POST** `/api/payments/create-razorpay-order`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderId": "order_id_from_your_system"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "razorpay_order_id": "order_123456",
    "amount": 199900,
    "currency": "INR",
    "order_id": "your_order_id",
    "key_id": "rzp_test_1234567890"
  }
}
```

### 2. Verify Payment
**POST** `/api/payments/verify-razorpay-payment`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "razorpay_payment_id": "pay_123456",
  "razorpay_order_id": "order_123456",
  "razorpay_signature": "signature_hash",
  "order_id": "your_order_id"
}
```

### 3. Create Direct UPI Payment
**POST** `/api/payments/create-upi-payment`

**Request Body:**
```json
{
  "orderId": "your_order_id",
  "upiId": "user@paytm"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "razorpay_order_id": "order_123456",
    "amount": 199900,
    "currency": "INR",
    "order_id": "your_order_id",
    "upi_url": "upi://pay?pa=merchant@paytm&pn=NexiCart&am=1999&cu=INR&tn=Order%20123",
    "upi_id": "user@paytm",
    "key_id": "rzp_test_1234567890"
  }
}
```

### 4. Get Payment Status
**GET** `/api/payments/status/:paymentId`

### 5. Refund Payment (Admin Only)
**POST** `/api/payments/refund`

**Request Body:**
```json
{
  "paymentId": "pay_123456",
  "amount": 1999.00,
  "orderId": "your_order_id"
}
```

## Frontend Integration

### 1. Installing Razorpay Checkout

Add this to your HTML head:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 2. JavaScript Integration

```javascript
// Create order first
const createOrder = async (orderData) => {
  const response = await fetch('/api/payments/create-razorpay-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ orderId: orderData.orderId })
  });
  return response.json();
};

// Initialize Razorpay payment
const initiatePayment = async (orderData) => {
  try {
    const { data } = await createOrder(orderData);
    
    const options = {
      key: data.key_id,
      amount: data.amount,
      currency: data.currency,
      name: 'NexiCart',
      description: `Order #${data.order_id}`,
      order_id: data.razorpay_order_id,
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '+919999999999'
      },
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true
      },
      theme: {
        color: '#3399cc'
      },
      handler: async function (response) {
        // Payment successful
        await verifyPayment({
          ...response,
          order_id: data.order_id
        });
      },
      modal: {
        ondismiss: function() {
          console.log('Payment cancelled');
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Payment initiation failed:', error);
  }
};

// Verify payment
const verifyPayment = async (paymentData) => {
  try {
    const response = await fetch('/api/payments/verify-razorpay-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });
    
    const result = await response.json();
    if (result.success) {
      // Payment verified successfully
      window.location.href = `/order-success/${result.data._id}`;
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
  }
};
```

### 3. UPI-Specific Integration

For UPI-only payments:

```javascript
const initiateUPIPayment = async (orderData, upiId) => {
  try {
    const response = await fetch('/api/payments/create-upi-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        orderId: orderData.orderId,
        upiId: upiId
      })
    });
    
    const { data } = await response.json();
    
    // Option 1: Open UPI app directly
    window.location.href = data.upi_url;
    
    // Option 2: Use Razorpay checkout with UPI preference
    const options = {
      key: data.key_id,
      amount: data.amount,
      currency: data.currency,
      name: 'NexiCart',
      description: `Order #${data.order_id}`,
      order_id: data.razorpay_order_id,
      method: {
        upi: true
      },
      prefill: {
        method: 'upi',
        'vpa': upiId
      },
      handler: function (response) {
        verifyPayment({
          ...response,
          order_id: data.order_id
        });
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('UPI payment failed:', error);
  }
};
```

## Database Changes

The Order model has been updated to support UPI payments:

```javascript
paymentMethod: {
  type: String,
  enum: ['stripe', 'paypal', 'cash', 'upi', 'razorpay']
}

paymentResult: {
  // ... existing fields
  razorpay_payment_id: String,
  razorpay_order_id: String,
  razorpay_signature: String,
  method: String, // 'upi', 'card', 'netbanking', etc.
  upi: {
    vpa: String // Virtual Payment Address (UPI ID)
  },
  amount: Number,
  currency: String,
  description: String
}
```

## Security Features

1. **Payment Signature Verification**: All payments are verified using Razorpay's signature mechanism
2. **User Authorization**: Only order owners can initiate/verify payments
3. **Order Validation**: Payments are validated against existing orders
4. **Secure Configuration**: API keys are stored in environment variables

## Testing

### Test Credentials

Razorpay provides test credentials for development:

```env
RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_KEY_SECRET=test_secret_key
```

### Test UPI IDs

- `success@razorpay`: Payment success
- `failure@razorpay`: Payment failure
- Any other valid UPI format: Payment success

### Test Cards

- **Card Number**: 4111111111111111
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Production Considerations

1. **KYC Completion**: Complete Razorpay KYC for live payments
2. **Webhook Setup**: Set up webhooks for payment status updates
3. **Rate Limiting**: Implement appropriate rate limiting
4. **Logging**: Add comprehensive payment logging
5. **Error Handling**: Implement robust error handling
6. **Backup Payment**: Keep alternative payment methods available

## Support

- **Razorpay Documentation**: [docs.razorpay.com](https://docs.razorpay.com)
- **UPI Guidelines**: [npci.org.in](https://www.npci.org.in)
- **Test Integration**: Use Razorpay's test environment

## Benefits of UPI Integration

1. **Instant Payments**: Real-time money transfer
2. **Low Transaction Fees**: Minimal charges compared to cards
3. **High Success Rate**: UPI has excellent success rates in India
4. **User Convenience**: No need to enter card details
5. **Mobile-First**: Perfect for mobile commerce
6. **Wide Adoption**: Supported by all major Indian banks

This integration makes your e-commerce platform ready for the Indian market with the most popular payment method in the country.
