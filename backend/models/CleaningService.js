const mongoose = require("mongoose");

const CleaningServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['FixUp', 'H2Go', 'PetConnect', 'WallFix & Style'],
    required: true
  },
  image: { type: String },
  quantity: { type: Number, required: true, default: 1 } // ✅ New field
});

module.exports = mongoose.model("CleaningService", CleaningServiceSchema);
