const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected");
    
    // Populate default reels if database is empty
    populateDefaultReels();
  } catch (err) {
    console.log("❌ DB Error:", err);
  }
}

function populateDefaultReels() {
    try {
        const srcDir = path.join(__dirname, '..', '..', 'reels');
        const destDir = path.join(__dirname, 'uploads');
        
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        
        // Copy files if they exist in srcDir
        if (fs.existsSync(srcDir)) {
            const files = fs.readdirSync(srcDir);
            files.forEach(file => {
                const srcPath = path.join(srcDir, file);
                const destPath = path.join(destDir, file);
                if (!fs.existsSync(destPath)) {
                    fs.copyFileSync(srcPath, destPath);
                    console.log(`Copied default reel: ${file}`);
                }
            });
        }
        
        // Check if database is empty to insert default data
        const Reel = mongoose.model('Reel');
        const User = mongoose.model('user');
        
        Reel.countDocuments().then(async (count) => {
            if (count === 0) {
                let demoUser = await User.findOne({ email: 'demo@reelify.com' });
                if (!demoUser) {
                    demoUser = await User.create({
                        fullName: 'Demo Business',
                        email: 'demo@reelify.com',
                        password: 'hashedpassworddummy'
                    });
                    console.log("Created demo user");
                }
                
                const defaultReels = [
                    {
                        user: demoUser._id,
                        businessName: 'ZenBrew Coffee',
                        category: 'Food & Drink',
                        description: 'Morning Brew Ritual #coffee #food',
                        reel: '/uploads/food.mp4',
                        bussinessUrl: 'https://zenbrew.coffee'
                    },
                    {
                        user: demoUser._id,
                        businessName: 'FitForge Gym',
                        category: 'Fitness',
                        description: '5-Min Full Body Burn #fitness #workout',
                        reel: '/uploads/fitness.mp4',
                        bussinessUrl: 'https://fitforge.com'
                    },
                    {
                        user: demoUser._id,
                        businessName: 'Nova Skin Studio',
                        category: 'Beauty',
                        description: 'Summer Glow Routine #beauty #glow',
                        reel: '/uploads/beauty.mp4',
                        bussinessUrl: 'https://novaskin.studio'
                    },
                    {
                        user: demoUser._id,
                        businessName: 'Bloom Florist',
                        category: 'Lifestyle',
                        description: 'Wildflower Arrangement #lifestyle #flowers',
                        reel: '/uploads/lifestyle.mp4',
                        bussinessUrl: 'https://bloomflorist.com'
                    },
                    {
                        user: demoUser._id,
                        businessName: 'Wanderlust Agency',
                        category: 'Travel',
                        description: 'Explore the world #travel #cinematic',
                        reel: '/uploads/travel.mp4',
                        bussinessUrl: 'https://wanderlust.com'
                    }
                ];
                
                await Reel.insertMany(defaultReels);
                console.log("Pre-populated real database with default reels!");
            }
        }).catch(e => console.error("Error checking/seeding real database:", e));
    } catch (e) {
        console.error("Error populating default reels:", e);
    }
}

module.exports = connectDB;
