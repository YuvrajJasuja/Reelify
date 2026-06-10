const path = require('path');
const fs = require('fs');

const mockMongoose = require('./mockMongoose');

const mongoUri = process.env.MONGO_URI || '';
const isDeadDomain = mongoUri.includes('food.jqtjfrr.mongodb.net');

if (isDeadDomain || process.env.USE_MOCK_DB === 'true' || !mongoUri) {
    console.log("⚠️ MongoDB Cloud URI is invalid or unavailable.");
    console.log("⚠️ Falling back to local JSON database storage (mockMongoose)...");
    
    try {
        const mongoosePath = require.resolve('mongoose');
        require.cache[mongoosePath] = {
            id: mongoosePath,
            filename: mongoosePath,
            loaded: true,
            exports: mockMongoose
        };
    } catch (err) {
        console.error("Failed to hijack mongoose in require cache:", err);
    }
}
