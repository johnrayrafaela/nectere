// models/CleaningService.js

const mongoose = require("mongoose");

const CleaningServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ["FixUp", "H2Go", "PetConnect", "Go Ride Connect"],
    required: true,
  },
  subcategory: { type: String },
  shopcategory: { type: String },
  image: { type: String },

  // New field for Go Ride Connect availability
  availability: {
    type: Boolean,
    default: true,
  },

  // If you still need quantity on the service document itself:
  quantity: { type: Number, required: true, default: 1 },
});

module.exports = mongoose.model("CleaningService", CleaningServiceSchema);
