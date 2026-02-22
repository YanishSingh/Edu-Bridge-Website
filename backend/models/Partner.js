import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const partnerSchema = new mongoose.Schema(
  {
    institutionName: { type: String, required: true, trim: true, maxlength: 200 },
    address: {
      country: { type: String, default: 'Nepal', maxlength: 100 },
      stateProvince: { type: String, required: true, trim: true, maxlength: 100 },
      cityDistrict: { type: String, required: true, trim: true, maxlength: 100 },
      areaLocalLevel: { type: String, required: true, trim: true, maxlength: 100 },
      wardNumber: { type: String, required: true, trim: true, maxlength: 10 },
      street: { type: String, trim: true, maxlength: 200 },
    },
    phoneNumber: { type: String, required: true, trim: true, maxlength: 20 },
    mobileNumber: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 255 },
    password: { type: String, required: true, select: false, maxlength: 200 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    rejectionReason: { type: String, trim: true, maxlength: 500 },
    rejectedAt: { type: Date },
  },
  { timestamps: true }
);

partnerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

partnerSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const Partner = mongoose.model('Partner', partnerSchema);
export default Partner;
