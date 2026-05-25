const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    examType: { type: String, required: true },
    date: { type: Date, default: Date.now },
    pdfUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
