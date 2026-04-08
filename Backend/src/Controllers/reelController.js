const reelModel = require("../Models/reelModel");

// Create a new reel
async function createReel(req, res) {
    try {
        const { businessName, title, description, hashtags, bussinessUrl } = req.body;
        const newReel = new reelModel({
            user: req.user._id,
            businessName,
            title,
            description,
            hashtags,
            bussinessUrl
        });
        await newReel.save();
        res.status(201).json({ message: "Reel created successfully", reel: newReel });
    } catch (error) {
        console.error("Error creating reel:", error);
        res.status(500).json({ message: "Failed to create reel" });
    }   
}

module.exports = { createReel };
