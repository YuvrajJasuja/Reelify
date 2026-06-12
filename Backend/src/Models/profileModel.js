const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    bio: {
        type: String,
        default: ""
    },
    aboutBusiness: {
        type: String,
        default: ""
    },
    contactEmail: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    website: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const profileModel = mongoose.model("profile", profileSchema);
module.exports = profileModel;
