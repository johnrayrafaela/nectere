const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "CleaningService" },

    firstname: String,
    lastname: String,
    phonenumber: String,
    email: String,
    address: String,
    paymentMethod: String,
    quantity: { type: Number, default: 1 },

    deliveryDate: String,
    deliveryTime: String,
    dropoffDate: String,
    dropoffTime: String,

    idealDate: { type: String, default: null },
    idealTime: { type: String, default: null },

    // Add these two fields:
    basePrice: { type: Number, default: 0 }, // Service price at booking time
    price: { type: Number, default: 0 },     // Destination price at booking time

    deliveryFee: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Completed"],
      default: "Pending"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);