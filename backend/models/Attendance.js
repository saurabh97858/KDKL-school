const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    status: { type: String, enum: ['Present', 'Absent', 'Leave'], required: true },
    className: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
