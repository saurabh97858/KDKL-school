const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    type: { type: String, default: 'Emergency' } // e.g., Holiday, Event, Emergency
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
