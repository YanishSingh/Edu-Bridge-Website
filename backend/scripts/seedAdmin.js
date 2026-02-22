/**
 * One-time script to create the first admin user.
 * Run from backend directory: node scripts/seedAdmin.js
 * Set ADMIN_EMAIL and ADMIN_PASSWORD in env or edit below.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
}, { timestamps: true });

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Admin = mongoose.model('Admin', AdminSchema);

async function seed() {
  const email = process.env.ADMIN_EMAIL || 'admin@edubridge.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edubridge');
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', email);
      process.exit(0);
      return;
    }
    await Admin.create({ email, password });
    console.log('Admin created:', email);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
