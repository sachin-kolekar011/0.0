const mongoose = require('mongoose');

const sportsEventSchema = new mongoose.Schema({
    sportsName: {
        type: String,
        required: true,
        trim: true
    },
    sportsOption: {
        type: String,
        enum: ['Kabaddi', 'Kho Kho', 'Carrom', 'Chess', 'Cricket', 'Volly-Ball', 'Basket-Ball', 'Hand-Ball'],
        required: true
    },
    eventType: {
        type: String,
        enum: ['Intercollegiate', 'Intracollegiate', 'Selection Trials'],
        required: true
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

const SportsEvent = mongoose.model('SportsEvent', sportsEventSchema);
module.exports = SportsEvent;
