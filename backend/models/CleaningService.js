const mongoose = require("mongoose");

const CleaningServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['FixUp', 'H2Go', 'PetConnect', 'Go Ride Connect'],
    required: true
  },
  subcategory: { type: String }, // Already present
  shopcategory: { type: String }, // <-- Add this line for shop category
  image: { type: String },
  quantity: { type: Number, required: true, default: 1 }
});

module.exports = mongoose.model("CleaningService", CleaningServiceSchema);