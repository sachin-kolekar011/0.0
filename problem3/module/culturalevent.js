const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
        trim: true
    },
    eventDescription: {
        type: String,
        required: true,
        trim: true
    },
    eventInstructions: {
        type: String,
        required: true,
        trim: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventLocation: {
        type: String,
        required: true,
        trim: true
    },
    eventTime: {
        type: String,
        required: true,
        trim: true
    },
    applicableFor: {
        type: String,
        enum: ['FY', 'SY', 'TY', 'BTech'],
        required: true
    },
    owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
}, { timestamps: true });

const culturalEvent = mongoose.model('culturalEvent', eventSchema);
module.exports = culturalEvent;
