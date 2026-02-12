import mongoose from 'mongoose';

const productionSchema = new mongoose.Schema(
  {
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: true },
    productName: { type: String, required: true, trim: true },
    contractQuantity: { type: Number, required: true, min: 1 },
    pieceWeight: { type: Number, required: true, min: 0.001 },
    totalPieces: { type: Number, required: true, min: 1 },
    totalWeight: { type: Number, required: true },
    operatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    shift: { type: String, enum: ['morning', 'evening', 'night'], required: true },
    meterReading: { type: Number },
    meterConsumption: { type: Number },
    notes: { type: String, trim: true },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

productionSchema.pre('save', function (next) {
  this.totalWeight = this.pieceWeight * this.totalPieces;
  next();
});

productionSchema.index({ date: -1, machineId: 1, operatorId: 1 });

export default mongoose.models.Production || mongoose.model('Production', productionSchema);
