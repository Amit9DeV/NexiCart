# 🛒 NexiCart - Modern E-Commerce Platform

A full-stack e-commerce platform built with Next.js, Express.js, and MongoDB, featuring modern UI design, comprehensive payment integration, and robust admin management.

![NexiCart Banner](https://img.shields.io/badge/NexiCart-E--Commerce-007ACC?style=for-the-badge&logo=shopping-cart)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![Express.js](https://img.shields.io/badge/Express.js-4.21.2-green?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-8.17.0-green?style=for-the-badge&logo=mongodb)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Payment Integration](#-payment-integration)
- [Admin Panel](#-admin-panel)
- [Typography System](#-typography-system)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🛍️ **E-Commerce Features**
- **Product Management**: Full CRUD operations with categories
- **Shopping Cart**: Persistent cart with real-time updates
- **User Authentication**: JWT-based auth with profile management
- **Order Management**: Complete order lifecycle tracking
- **Product Reviews**: User-generated reviews and ratings
- **Search & Filtering**: Advanced search with category filters
- **Wishlist**: Save favorite products for later

### 💳 **Payment Integration**
- **Multiple Payment Methods**:
  - UPI (Unified Payments Interface)
  - Credit/Debit Cards
  - Net Banking
  - Cash on Delivery (COD)
  - Razorpay Integration
- **Secure Payment Processing**: Signature verification
- **Payment Status Tracking**: Real-time payment updates
- **Refund Management**: Admin-controlled refund system

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach
- **Modern Typography**: Roboto Slab font system
- **Dark/Light Themes**: Customizable appearance
- **Smooth Animations**: Framer Motion integration
- **Interactive Components**: Hover effects and transitions
- **Loading States**: Skeleton loaders and spinners

### 🔧 **Admin Panel**
- **Dashboard Analytics**: Sales, orders, and user metrics
- **Product Management**: Add, edit, delete products
- **Order Management**: Process and track orders
- **User Management**: View and manage user accounts
- **Category Management**: Organize product categories
- **Homepage Sections**: Customize landing page content

### 🔒 **Security Features**
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs encryption
- **Input Validation**: Express-validator middleware
- **Rate Limiting**: API request throttling
- **CORS Protection**: Cross-origin resource sharing
- **Helmet Security**: HTTP headers protection

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.3.4** - React framework with App Router
- **React 19.0.0** - UI library
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Framer Motion 12.23.12** - Animation library
- **Axios 1.11.0** - HTTP client
- **React Hot Toast 2.5.2** - Notification system
- **Chart.js 4.5.0** - Data visualization
- **Lucide React 0.534.0** - Icon library

### **Backend**
- **Express.js 4.21.2** - Node.js web framework
- **MongoDB 8.17.0** - NoSQL database
- **Mongoose 8.17.0** - MongoDB ODM
- **JWT 9.0.2** - Authentication tokens
- **bcryptjs 3.0.2** - Password hashing
- **Multer 2.0.2** - File upload handling
- **Nodemailer 7.0.5** - Email functionality
- **Razorpay 2.9.6** - Payment gateway

### **Development Tools**
- **ESLint 9** - Code linting
- **PostCSS 8** - CSS processing
- **Autoprefixer 10.0.1** - CSS vendor prefixes
- **Nodemon 3.1.10** - Development server

## 📁 Project Structure

```
NexiCart/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   │   ├── admin/     # Admin panel pages
│   │   │   ├── auth/      # Authentication pages
│   │   │   ├── cart/      # Shopping cart
│   │   │   ├── category/  # Product categories
│   │   │   ├── checkout/  # Checkout process
│   │   │   ├── products/  # Product pages
│   │   │   └── profile/   # User profile
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── utils/         # Helper functions
│   ├── public/            # Static assets
│   └── tailwind.config.js # Tailwind configuration
├── server/                # Express.js Backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── uploads/           # File uploads
│   └── utils/             # Utility functions
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nexicart.git
   cd nexicart
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In server directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (from server directory)
   npm run dev

   # Start frontend server (from client directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/nexicart

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/categories` - Get all categories
- `GET /api/products/category/:category` - Get products by category

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order payment

### Payment Endpoints
- `POST /api/payments/create-razorpay-order` - Create payment order
- `POST /api/payments/verify-razorpay-payment` - Verify payment
- `POST /api/payments/create-upi-payment` - Direct UPI payment
- `GET /api/payments/status/:paymentId` - Check payment status

For complete API documentation, see [API_DOCUMENTATION.md](server/API_DOCUMENTATION.md)

## 💳 Payment Integration

NexiCart supports multiple payment methods through Razorpay integration:

### Supported Payment Methods
- **UPI**: Unified Payments Interface
- **Cards**: Credit/Debit cards
- **Net Banking**: Online banking
- **Wallets**: Digital wallets
- **COD**: Cash on Delivery

### Payment Flow
1. User selects products and proceeds to checkout
2. Order is created in pending state
3. Payment gateway integration creates payment order
4. User completes payment through preferred method
5. Payment verification updates order status
6. Order confirmation sent to user

For detailed payment setup, see [UPI_PAYMENT_SETUP.md](server/UPI_PAYMENT_SETUP.md)

## 👨‍💼 Admin Panel

### Features
- **Dashboard**: Sales analytics and metrics
- **Product Management**: CRUD operations for products
- **Order Management**: Process and track orders
- **User Management**: View and manage user accounts
- **Category Management**: Organize product categories
- **Homepage Sections**: Customize landing page

### Access
- URL: `/admin`
- Default admin credentials are created during setup
- Use `npm run admin:setup` to create admin account

## 🎨 Typography System

NexiCart features a comprehensive typography system built with Roboto Slab:

### Font Hierarchy
- **Display Typography**: Large, impactful headlines
- **Heading Hierarchy**: H1-H6 with consistent spacing
- **Body Text**: Multiple sizes for different content types
- **UI Typography**: Buttons, navigation, and form elements
- **Code Typography**: Monospace fonts for technical content

### Typography Classes
```css
/* Display */
.display-large, .display-medium, .display-small

/* Headings */
.h1, .h2, .h3, .h4, .h5, .h6

/* Body */
.body-large, .body, .body-small, .caption

/* UI */
.btn-text, .nav-text, .form-label, .badge-text

/* Code */
.code, .code-small, .mono
```

View the typography demo at `/typography-demo`

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Add to server/package.json
"scripts": {
  "start": "node server.js"
}

# Deploy to Heroku
heroku create your-app-name
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Set all required environment variables in your deployment platform:
- MongoDB connection string
- JWT secret
- Payment gateway credentials
- Email configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Test thoroughly before submitting
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Razorpay](https://razorpay.com/) - Payment gateway
- [MongoDB](https://mongodb.com/) - Database
- [Framer Motion](https://framer.com/motion) - Animation library

## 📞 Support

For support and questions:
- Create an issue in the repository
- Email: support@nexicart.com
- Documentation: [Wiki](https://github.com/yourusername/nexicart/wiki)

---

**Made with ❤️ by the NexiCart Team**
