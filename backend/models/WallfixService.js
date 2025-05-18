const mongoose = require('mongoose');

const wallfixServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['FixUp', 'H2Go', 'PetConnect', 'WallFix'], 
    required: true 
  }
});

const WallfixService = mongoose.model('WallfixService', wallfixServiceSchema);

module.exports = WallfixService;
