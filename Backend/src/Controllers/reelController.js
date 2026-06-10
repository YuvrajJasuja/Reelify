const reelModel = require("../Models/reelModel");

// Create a new reel
async function createReel(req, res) {
    try {
        const { businessName, category, description, bussinessUrl } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: "Video file is required" });
        }

        const videoUrl = `http://localhost:1000/uploads/${req.file.filename}`;

        const newReel = new reelModel({
            user: req.user._id,
            businessName,
            category,
            description,
            reel: videoUrl,
            bussinessUrl
        });
        await newReel.save();
        res.status(201).json({ message: "Reel created successfully", reel: newReel });
    } catch (error) {
        console.error("Error creating reel:", error);
        res.status(500).json({ message: "Failed to create reel" });
    }   
}

// Get all reels
async function getReels(req, res) {
    try {
        const reels = await reelModel.find().populate("user", "fullName email");
        res.status(200).json(reels);
    } catch (error) {
        console.error("Error fetching reels:", error);
        res.status(500).json({ message: "Failed to fetch reels" });
    }
}

module.exports = { createReel, getReels };
