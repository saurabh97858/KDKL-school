const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    className: { type: String, required: true },
    emailId: { type: String },
    motherName: { type: String, required: true },
    fatherName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    currentAddress: { type: String, required: true },
    fees: { type: Number, required: true },
    medium: { type: String, enum: ['Hindi', 'English'], default: 'Hindi' },
    stream: { type: String, enum: ['Science', 'Commerce', 'Arts', 'None'], default: 'None' },
    previousSchool: { type: String },
    admissionDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
