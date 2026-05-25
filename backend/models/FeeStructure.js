const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
    className: { type: String, required: true },
    medium: { type: String, enum: ['Hindi', 'English'], default: 'Hindi' },
    tuitionFee: { type: Number, default: 0 },
    booksFee: { type: Number, default: 0 },
    dressFee: { type: Number, default: 0 },
    admissionCharges: { type: Number, default: 0 },
    otherCharges: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
}, { timestamps: true });

feeStructureSchema.index({ className: 1, medium: 1 }, { unique: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
