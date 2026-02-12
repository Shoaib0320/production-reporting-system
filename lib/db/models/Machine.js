import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'مشین کا نام ضروری ہے'], trim: true },
    tonnage: { type: Number, required: [true, 'ٹن ضروری ہے'] },
    code: { type: String, required: [true, 'کوڈ ضروری ہے'], unique: true, uppercase: true },
    isActive: { type: Boolean, default: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.Machine || mongoose.model('Machine', machineSchema);
