const mongoose = require('mongoose');

const momentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Moment', momentSchema);
