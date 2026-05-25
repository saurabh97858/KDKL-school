const mongoose = require('mongoose');

const feeRecordSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    totalFees: { type: Number, required: true, default: 0 },
    depositedFees: { type: Number, default: 0 },
    pendingFees: { type: Number, default: 0 },
    fine: { type: Number, default: 0 },
    fineDescription: { type: String, default: '' },
    otherCharges: { type: Number, default: 0 },
    otherChargesDescription: { type: String, default: '' },
    lastPaymentDate: { type: Date },
    dueDate: { type: Date },
    remarks: { type: String, default: '' },
    paymentHistory: [{
        amount: { type: Number, required: true },
        paymentDate: { type: Date, default: Date.now },
        mode: { type: String, enum: ['Cash', 'Online', 'Cheque', 'DD'], default: 'Cash' },
        receipt: { type: String, default: '' },
        note: { type: String, default: '' }
    }]
}, { timestamps: true });

// Auto-calculate pending fees before save
feeRecordSchema.pre('save', function(next) {
    this.pendingFees = (this.totalFees + this.fine + this.otherCharges) - this.depositedFees;
    next();
});

module.exports = mongoose.model('FeeRecord', feeRecordSchema);
