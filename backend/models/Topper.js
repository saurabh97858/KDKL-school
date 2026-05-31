const mongoose = require('mongoose');

const topperSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    className: { type: String, required: true },
    percentage: { type: String, required: true },
    stream: { type: String, required: false },
    examTerm: { type: String, required: false },
    imageUrl: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Topper', topperSchema);
