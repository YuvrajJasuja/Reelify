const profileModel = require("../Models/profileModel");

async function getProfile(req, res) {
    try {
        const userId = req.user._id;
        let profile = await profileModel.findOne({ userId });
        
        // If profile doesn't exist, return default values initialized with account defaults
        if (!profile) {
            profile = {
                userId,
                bio: "",
                aboutBusiness: "",
                contactEmail: req.user.email, // default to account email
                phoneNumber: "",
                website: "",
                location: ""
            };
        }
        
        res.status(200).json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error fetching profile" });
    }
}

async function updateProfile(req, res) {
    try {
        const userId = req.user._id;
        const { bio, aboutBusiness, contactEmail, phoneNumber, website, location } = req.body;
        
        const profile = await profileModel.findOneAndUpdate(
            { userId },
            {
                bio: bio || "",
                aboutBusiness: aboutBusiness || "",
                contactEmail: contactEmail || "",
                phoneNumber: phoneNumber || "",
                website: website || "",
                location: location || ""
            },
            { new: true, upsert: true }
        );
        
        res.status(200).json({
            message: "Profile updated successfully",
            profile
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error updating profile" });
    }
}

const userModel = require("../Models/userModel");

async function getPublicProfile(req, res) {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId).select("fullName email profilePicture");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let profile = await profileModel.findOne({ userId });
        
        // If profile doesn't exist, return default values initialized with account defaults
        if (!profile) {
            profile = {
                userId,
                bio: "",
                aboutBusiness: "",
                contactEmail: user.email,
                phoneNumber: "",
                website: "",
                location: ""
            };
        }
        
        res.status(200).json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePicture: user.profilePicture
            },
            profile
        });
    } catch (error) {
        console.error("Error fetching public profile:", error);
        res.status(500).json({ message: "Server error fetching public profile" });
    }
}

module.exports = {
    getProfile,
    updateProfile,
    getPublicProfile
};
