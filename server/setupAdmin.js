#!/usr/bin/env node

const mongoose = require('mongoose');
const readline = require('readline');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

const setupAdmin = async () => {
  try {
    console.log('🚀 NexiCart Admin Setup');
    console.log('=======================\n');

    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('📧 Existing admin email:', existingAdmin.email);
      console.log('💡 If you need to create another admin, use the admin dashboard after logging in.\n');
      
      const createAnother = await question('Do you want to create another admin account? (y/N): ');
      if (createAnother.toLowerCase() !== 'y' && createAnother.toLowerCase() !== 'yes') {
        console.log('👋 Setup cancelled.');
        process.exit();
      }
    }

    console.log('📝 Please provide admin details:\n');
    
    const name = await question('Admin Name: ');
    if (!name.trim()) {
      console.log('❌ Name is required!');
      process.exit(1);
    }

    const email = await question('Admin Email: ');
    if (!email.trim() || !email.includes('@')) {
      console.log('❌ Valid email is required!');
      process.exit(1);
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User with this email already exists!');
      process.exit(1);
    }

    const password = await question('Admin Password (min 6 characters): ');
    if (!password.trim() || password.length < 6) {
      console.log('❌ Password must be at least 6 characters long!');
      process.exit(1);
    }

    // Create admin user (password will be hashed by the User model pre-save hook)
    const adminUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role: 'admin',
      addresses: []
    });

    await adminUser.save();
    
    console.log('\n✅ Admin user created successfully!');
    console.log('==================================');
    console.log('📧 Email:', email.trim().toLowerCase());
    console.log('🔐 Password: [Hidden for security]');
    console.log('==================================');
    console.log('🚀 You can now login to the admin dashboard!');
    console.log('🌐 Visit: http://localhost:3000/admin');
    console.log('💡 Remember to keep your credentials secure.\n');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Setup cancelled by user.');
  rl.close();
  process.exit();
});

setupAdmin();
