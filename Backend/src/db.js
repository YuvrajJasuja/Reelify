const mongoose = require('mongoose');

async function connectDB() {
 mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.log("❌ DB Error:", err));
}

module.exports = connectDB;
