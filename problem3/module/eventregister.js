const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    eventCategory: {
        type: String,
        required: true,
        enum: ['cultural', 'sports', 'workshop', 'seminar'] // Add other categories as needed
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);

module.exports = EventRegistration;
