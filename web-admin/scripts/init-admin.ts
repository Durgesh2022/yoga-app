// scripts/initAdmin.ts
import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../app/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/astro-dashboard';

async function initializeAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@astro.com' });

    if (adminExists) {
      console.log('ℹ️  Admin user already exists');
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const admin = new User({
      fullName: 'Admin User',
      email: 'admin@astro.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@astro.com');
    console.log('🔑 Password: admin123');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error initializing admin:', error);
    process.exit(1);
  }
}

initializeAdmin();