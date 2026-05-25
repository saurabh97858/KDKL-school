const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Founder', founderSchema);
