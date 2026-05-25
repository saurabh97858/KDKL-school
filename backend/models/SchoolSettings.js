const mongoose = require('mongoose');

const schoolSettingsSchema = new mongoose.Schema({
    address: { type: String, default: 'School Address' },
    phone1: { type: String, default: '91xxxxxxxx' },
    phone2: { type: String, default: '91xxxxxxxx' },
    email: { type: String, default: 'school@example.com' },
    instagramUrl: { type: String, default: 'https://instagram.com' },
    facebookUrl: { type: String, default: 'https://facebook.com' },
    admissionCloudText: { type: String, default: 'ADMISSION OPEN 2026-27' },
    showFeeStructureInNavbar: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('SchoolSettings', schoolSettingsSchema);
