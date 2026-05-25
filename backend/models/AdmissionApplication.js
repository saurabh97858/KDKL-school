const mongoose = require('mongoose');

const admissionApplicationSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    className: { type: String, required: true },
    emailId: { type: String },
    motherName: { type: String, required: true },
    fatherName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    currentAddress: { type: String, required: true },
    previousSchool: { type: String },
    medium: { type: String, default: 'Hindi' },
    stream: { type: String, default: 'None' },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Enrolled'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('AdmissionApplication', admissionApplicationSchema);
