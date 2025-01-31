const mongoose = require('mongoose');

// Define the TeamMember schema
const teamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
});

// Define the Hackathon schema
const hackathonRegistrationSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    leader: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
    },
    teamMembers: [teamMemberSchema], // An array of team members
    projectIdea: { type: String, required: true },
}, { timestamps: true });  


const HackathonRegistration = mongoose.model('HackathonRegistration', hackathonRegistrationSchema);

module.exports = HackathonRegistration;


