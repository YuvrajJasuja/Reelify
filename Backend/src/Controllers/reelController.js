const imagekit = require('../storage');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const reelModel = require("../Models/reelModel");

// Create a new reel
async function createReel(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Video file is required" });
        }

        const caption = req.body.caption || "";
        const category = req.body.category;

        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        const validCategories = [
            "Food & Drink",
            "Fitness",
            "Beauty",
            "Technology",
            "Lifestyle",
            "Fashion",
            "Travel"
        ];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: "Invalid category selected" });
        }
        
        // Generate unique filename using UUID
        const uniqueFileName = `${uuidv4()}${path.extname(req.file.originalname)}`;

        // Upload to ImageKit
        const uploadResponse = await imagekit.upload({
            file: req.file.buffer, // buffer from memory storage
            fileName: uniqueFileName,
            folder: '/reels'
        });

        const newReel = new reelModel({
            videoUrl: uploadResponse.url,
            uploadedBy: req.user._id,
            uploaderName: req.user.fullName,
            caption: caption,
            category: category
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
        // Fetch sorted by newest first, populate uploader info
        const reels = await reelModel.find()
            .sort({ createdAt: -1 })
            .populate("uploadedBy", "fullName email");
            
        const protocol = req.protocol;
        const host = req.get('host');
        
        const mappedReels = reels.map(r => {
            const doc = r.toObject ? r.toObject() : { ...r };
            // Format videoUrl for local seed data if a relative path is used
            if (doc.videoUrl && doc.videoUrl.startsWith('/')) {
                doc.videoUrl = `${protocol}://${host}${doc.videoUrl}`;
            }
            return doc;
        });

        res.status(200).json(mappedReels);
    } catch (error) {
        console.error("Error fetching reels:", error);
        res.status(500).json({ message: "Failed to fetch reels" });
    }
}

// Get a single reel by ID
async function getReelById(req, res) {
    try {
        const reel = await reelModel.findById(req.params.reelId)
            .populate("uploadedBy", "fullName email");
            
        if (!reel) {
            return res.status(404).json({ message: "Reel not found" });
        }

        const protocol = req.protocol;
        const host = req.get('host');
        const doc = reel.toObject ? reel.toObject() : { ...reel };
        if (doc.videoUrl && doc.videoUrl.startsWith('/')) {
            doc.videoUrl = `${protocol}://${host}${doc.videoUrl}`;
        }

        res.status(200).json(doc);
    } catch (error) {
        console.error("Error fetching reel by ID:", error);
        res.status(500).json({ message: "Failed to fetch reel" });
    }
}

// Get all reels uploaded by a specific user
async function getUserReels(req, res) {
    try {
        const reels = await reelModel.find({ uploadedBy: req.params.userId })
            .sort({ createdAt: -1 });

        const protocol = req.protocol;
        const host = req.get('host');
        
        const mappedReels = reels.map(r => {
            const doc = r.toObject ? r.toObject() : { ...r };
            if (doc.videoUrl && doc.videoUrl.startsWith('/')) {
                doc.videoUrl = `${protocol}://${host}${doc.videoUrl}`;
            }
            return doc;
        });

        res.status(200).json(mappedReels);
    } catch (error) {
        console.error("Error fetching user reels:", error);
        res.status(500).json({ message: "Failed to fetch user reels" });
    }
}

module.exports = { createReel, getReels, getReelById, getUserReels };
