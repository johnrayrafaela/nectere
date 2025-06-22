// controllers/bookingController.js

const Booking = require("../models/Booking");
const CleaningService = require("../models/CleaningService");
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
      quantity,
      deliveryDate,
      deliveryTime,
      dropoffDate,
      dropoffTime,
      deliveryFee,
      basePrice,
      price,
      // Add these for FixUp
      idealDate,
      idealTime
    } = req.body;

    // Basic required fields
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

    // Check service availability if Go Ride Connect
    const service = await CleaningService.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    if (service.category === "Go Ride Connect" && !service.availability) {
      return res
        .status(400)
        .json({ message: "This car is currently unavailable" });
    }

    // Require delivery/dropoff fields for Go Ride Connect
    if (service.category === "Go Ride Connect") {
      if (
        !deliveryDate ||
        !deliveryTime ||
        !dropoffDate ||
        !dropoffTime
      ) {
        return res.status(400).json({ message: "Delivery and dropoff date/time are required" });
      }
    }

    // Require idealDate/idealTime for FixUp
    if (service.category === "FixUp") {
      if (!idealDate || !idealTime) {
        return res.status(400).json({ message: "Ideal date and time are required for FixUp bookings" });
      }
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
      quantity: quantity || 1,
      deliveryFee: deliveryFee || 0,
      deliveryDate,
      deliveryTime,
      dropoffDate,
      dropoffTime,
      basePrice: basePrice || 0,
      price: price || 0,
      // Save idealDate and idealTime for FixUp
      idealDate: idealDate || null,
      idealTime: idealTime || null,
    });

    await newBooking.save();

    // Immediately mark car as pending (unavailable) in service if Go Ride Connect
    if (service.category === "Go Ride Connect") {
      service.availability = false;
      await service.save();
    }

    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
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
      .populate("serviceId");
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
    const booking = await Booking.findById(req.params.id).populate("serviceId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!["Accepted", "Rejected", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // If service is Go Ride Connect, update availability accordingly
    const service = booking.serviceId;
    if (service.category === "Go Ride Connect") {
      if (status === "Accepted") {
        service.availability = false; // confirmed booking → unavailable
      } else if (status === "Rejected" || status === "Completed") {
        service.availability = true; // reject or complete → back to available
      }
      await service.save();
    }

    booking.status = status;
    await booking.save();

    // If there's an assigned employee, update their availability as before
    if (booking.employeeId) {
      if (status === "Accepted") {
        await Employee.findByIdAndUpdate(booking.employeeId, { availability: false });
      } else {
        await Employee.findByIdAndUpdate(booking.employeeId, { availability: true });
      }
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

    // If deleting a Go Ride Connect booking that was pending or accepted,
    // mark the associated car available again:
    const service = await CleaningService.findById(booking.serviceId);
    if (service && service.category === "Go Ride Connect") {
      service.availability = true;
      await service.save();
    }

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
