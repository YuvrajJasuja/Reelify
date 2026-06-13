const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected");
    
    // Perform cleanup of dummy data
    await cleanDummyData();
  } catch (err) {
    console.log("❌ DB Error:", err);
  }
}

async function cleanDummyData() {
  try {
    const Reel = mongoose.model('Reel');
    const User = mongoose.model('user');

    // Find and delete the demo user and their reels
    const demoUser = await User.findOne({ email: 'demo@reelify.com' });
    if (demoUser) {
      const deletedReels = await Reel.deleteMany({ uploadedBy: demoUser._id });
      console.log(`🧹 Deleted ${deletedReels.deletedCount} dummy reels`);
      
      await User.deleteOne({ _id: demoUser._id });
      console.log("🧹 Deleted demo user");
    }

    // Delete any remaining reels with dummy uploader names just in case
    const dummyNames = ['ZenBrew Coffee', 'FitForge Gym', 'Nova Skin Studio', 'Bloom Florist', 'Wanderlust Agency'];
    const extraDeleted = await Reel.deleteMany({ uploaderName: { $in: dummyNames } });
    if (extraDeleted.deletedCount > 0) {
      console.log(`🧹 Deleted ${extraDeleted.deletedCount} extra dummy reels`);
    }
  } catch (err) {
    console.error("Error cleaning dummy database records:", err);
  }
}

module.exports = connectDB;
