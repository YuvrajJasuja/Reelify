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
        const reelsFile = path.join(__dirname, 'db_data', 'reels.json');
        const usersFile = path.join(__dirname, 'db_data', 'users.json');
        
        // Check if mock database is active
        const mongoUri = process.env.MONGO_URI || '';
        const isMockDb = mongoUri.includes('food.jqtjfrr.mongodb.net') || process.env.USE_MOCK_DB === 'true' || !mongoUri;
        
        if (isMockDb) {
            let users = [];
            if (fs.existsSync(usersFile)) {
                try {
                    users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
                } catch {}
            }
            
            // Create a default demo user if none exists
            let demoUser = users.find(u => u.email === 'demo@reelify.com');
            if (!demoUser) {
                demoUser = {
                    _id: 'demouserid12345',
                    fullName: 'Demo Business',
                    email: 'demo@reelify.com',
                    password: 'hashedpassworddummy',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                users.push(demoUser);
                fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
                console.log("Created demo user");
            }
            
            let reels = [];
            if (fs.existsSync(reelsFile)) {
                try {
                    reels = JSON.parse(fs.readFileSync(reelsFile, 'utf8'));
                } catch {}
            }
            
            if (reels.length === 0) {
                const defaultReels = [
                    {
                        _id: 'defaultreel1',
                        user: demoUser._id,
                        businessName: 'ZenBrew Coffee',
                        category: 'Food & Drink',
                        description: 'Morning Brew Ritual #coffee #food',
                        reel: 'http://localhost:1000/uploads/food.mp4',
                        bussinessUrl: 'https://zenbrew.coffee',
                        uploadedAt: new Date().toISOString()
                    },
                    {
                        _id: 'defaultreel2',
                        user: demoUser._id,
                        businessName: 'FitForge Gym',
                        category: 'Fitness',
                        description: '5-Min Full Body Burn #fitness #workout',
                        reel: 'http://localhost:1000/uploads/fitness.mp4',
                        bussinessUrl: 'https://fitforge.com',
                        uploadedAt: new Date().toISOString()
                    },
                    {
                        _id: 'defaultreel3',
                        user: demoUser._id,
                        businessName: 'Nova Skin Studio',
                        category: 'Beauty',
                        description: 'Summer Glow Routine #beauty #glow',
                        reel: 'http://localhost:1000/uploads/beauty.mp4',
                        bussinessUrl: 'https://novaskin.studio',
                        uploadedAt: new Date().toISOString()
                    },
                    {
                        _id: 'defaultreel4',
                        user: demoUser._id,
                        businessName: 'Bloom Florist',
                        category: 'Lifestyle',
                        description: 'Wildflower Arrangement #lifestyle #flowers',
                        reel: 'http://localhost:1000/uploads/lifestyle.mp4',
                        bussinessUrl: 'https://bloomflorist.com',
                        uploadedAt: new Date().toISOString()
                    },
                    {
                        _id: 'defaultreel5',
                        user: demoUser._id,
                        businessName: 'Wanderlust Agency',
                        category: 'Travel',
                        description: 'Explore the world #travel #cinematic',
                        reel: 'http://localhost:1000/uploads/travel.mp4',
                        bussinessUrl: 'https://wanderlust.com',
                        uploadedAt: new Date().toISOString()
                    }
                ];
                fs.writeFileSync(reelsFile, JSON.stringify(defaultReels, null, 2), 'utf8');
                console.log("Pre-populated mock database with default reels!");
            }
        } else {
            // For a real DB, check if the Reels collection is empty, and seed it if empty
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
                    }
                    
                    const defaultReels = [
                        {
                            user: demoUser._id,
                            businessName: 'ZenBrew Coffee',
                            category: 'Food & Drink',
                            description: 'Morning Brew Ritual #coffee #food',
                            reel: 'http://localhost:1000/uploads/food.mp4',
                            bussinessUrl: 'https://zenbrew.coffee'
                        },
                        {
                            user: demoUser._id,
                            businessName: 'FitForge Gym',
                            category: 'Fitness',
                            description: '5-Min Full Body Burn #fitness #workout',
                            reel: 'http://localhost:1000/uploads/fitness.mp4',
                            bussinessUrl: 'https://fitforge.com'
                        },
                        {
                            user: demoUser._id,
                            businessName: 'Nova Skin Studio',
                            category: 'Beauty',
                            description: 'Summer Glow Routine #beauty #glow',
                            reel: 'http://localhost:1000/uploads/beauty.mp4',
                            bussinessUrl: 'https://novaskin.studio'
                        },
                        {
                            user: demoUser._id,
                            businessName: 'Bloom Florist',
                            category: 'Lifestyle',
                            description: 'Wildflower Arrangement #lifestyle #flowers',
                            reel: 'http://localhost:1000/uploads/lifestyle.mp4',
                            bussinessUrl: 'https://bloomflorist.com'
                        },
                        {
                            user: demoUser._id,
                            businessName: 'Wanderlust Agency',
                            category: 'Travel',
                            description: 'Explore the world #travel #cinematic',
                            reel: 'http://localhost:1000/uploads/travel.mp4',
                            bussinessUrl: 'https://wanderlust.com'
                        }
                    ];
                    
                    await Reel.insertMany(defaultReels);
                    console.log("Pre-populated real database with default reels!");
                }
            }).catch(e => console.error("Error checking/seeding real database:", e));
        }
    } catch (e) {
        console.error("Error populating default reels:", e);
    }
}

module.exports = connectDB;

