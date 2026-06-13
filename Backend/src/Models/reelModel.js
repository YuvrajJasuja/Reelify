const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // References userModel registered as "user"
    required: true
  },
  uploaderName: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Food & Drink",
      "Fitness",
      "Beauty",
      "Technology",
      "Lifestyle",
      "Fashion",
      "Travel"
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Reel", reelSchema);