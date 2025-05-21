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
    // Example schema updates
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Completed"],
      default: "Pending"
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
