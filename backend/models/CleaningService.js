const mongoose = require("mongoose");

const CleaningServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['FixUp', 'H2Go', 'PetConnect', 'WallFix'],
    required: true
  },
  image: { type: String } // store image filename or URL
});

module.exports = mongoose.model("CleaningService", CleaningServiceSchema);
