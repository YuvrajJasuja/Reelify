const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  businessName: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  reel: { type: String, required: true },
  bussinessUrl: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Reel", reelSchema);