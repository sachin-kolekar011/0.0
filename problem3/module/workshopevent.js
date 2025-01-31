const mongoose = require('mongoose');

const workshopEventSchema = new mongoose.Schema({
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
    applicableFor: {
        type: String,
        enum: ['FY', 'SY', 'TY', 'BTech', 'All'],
        required: true
    },
    owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
}, { timestamps: true });

const WorkshopEvent = mongoose.model('WorkshopEvent', workshopEventSchema);
module.exports = WorkshopEvent;
