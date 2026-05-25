const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacherName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    emailId: { type: String },
    currentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    salary: { type: Number, required: true },
    subject: { type: String, required: true },
    assignedClass: { type: String, required: true },
    profilePic: { type: String },
    qualification: { type: String },
    experience: { type: String },
    expertIn: { type: String },
    medium: { type: String, enum: ['Hindi', 'English'], default: 'Hindi' },
    role: { type: String, default: 'Teacher' }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
