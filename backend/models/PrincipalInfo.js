const mongoose = require('mongoose');

const principalInfoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    experience: { type: String, required: true },
    imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('PrincipalInfo', principalInfoSchema);
