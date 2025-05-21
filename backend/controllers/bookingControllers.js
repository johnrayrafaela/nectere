const Booking = require("../models/Booking");
const Employee = require("../models/Employee");
const mongoose = require("mongoose");

// Create a booking
exports.createBooking = async (req, res) => {
  try {
    const {
      userId,
      serviceId,
      firstname,
      lastname,
      phonenumber,
      email,
      address,
      paymentMethod,
      quantity // <-- Add this line

    } = req.body;

    if (
      !userId ||
      !serviceId ||
      !firstname ||
      !lastname ||
      !phonenumber ||
      !email ||
      !address ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBooking = new Booking({
      userId,
      serviceId,
      firstname,
      lastname,
      phonenumber,
      email,
      address,
      paymentMethod,
      quantity: quantity || 1
      
    });

    await newBooking.save();

    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId")
      .populate("serviceId")

    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Error in getAllBookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId")
      .populate("serviceId")
      .populate("employeeId");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!["Accepted", "Rejected", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    booking.status = status;
    await booking.save();

    if (status === "Accepted") {
      await Employee.findByIdAndUpdate(booking.employeeId, { availability: false });
    } else {
      await Employee.findByIdAndUpdate(booking.employeeId, { availability: true });
    }

    res.status(200).json({ message: `Booking ${status.toLowerCase()}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all bookings for an employee
exports.getBookingsForEmployee = async (req, res) => {
  const { employeeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({ message: "Invalid employee ID" });
  }

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const bookings = await Booking.find({ employeeId })
      .populate("userId")
      .populate("serviceId");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings for employee", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
