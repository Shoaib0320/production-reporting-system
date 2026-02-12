import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'نام ضروری ہے'], trim: true },
    email: { type: String, required: [true, 'ای میل ضروری ہے'], unique: true, lowercase: true, trim: true },
    phone: { type: String, required: [true, 'فون نمبر ضروری ہے'], unique: true },
    password: { type: String, required: [true, 'پاس ورڈ ضروری ہے'], minlength: 6, select: false },
    role: { type: String, enum: ['admin', 'operator', 'supervisor'], default: 'operator' },
    machineIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Machine' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
