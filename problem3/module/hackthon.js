const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String },
    prizePool: { type: Number, default: 0 },
    categories: [{ type: String }],  // AI, Web Dev, IoT, etc.
    rules: [{ type: String }],  
    maxTeamSize: { type: Number, default: 4 },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
}, { timestamps: true });

const Hackathon = mongoose.model('Hackathon', hackathonSchema);

module.exports = Hackathon;
