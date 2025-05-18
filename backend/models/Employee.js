const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, default: "employee" },
  password: { type: String, required: false },
  availability: { type: Boolean, default: true },
  availableUntil: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
