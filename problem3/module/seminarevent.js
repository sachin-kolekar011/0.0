const mongoose = require('mongoose');

const seminarEventSchema = new mongoose.Schema({
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
    guestNames: {
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
        required: true
    },
    owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
}, { timestamps: true });

const SeminarEvent = mongoose.model('SeminarEvent', seminarEventSchema);
module.exports = SeminarEvent;
