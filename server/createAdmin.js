const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('📧 Existing admin email:', existingAdmin.email);
      console.log('💡 If you need to create another admin, use the admin dashboard.');
      process.exit();
    }

    // Create admin user (password will be hashed by the User model pre-save hook)
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@nexicart.com',
      password: 'admin123',
      role: 'admin',
      addresses: [{
        type: 'home',
        street: '123 Admin Street',
        city: 'Admin City',
        state: 'Admin State',
        zipCode: '12345',
        country: 'Admin Country',
        isDefault: true
      }]
    });

    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('==================================');
    console.log('📧 Email: admin@nexicart.com');
    console.log('🔐 Password: admin123');
    console.log('==================================');
    console.log('🚀 You can now login to the admin dashboard!');
    console.log('💡 Remember to change the password after first login.');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
