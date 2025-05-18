const express = require("express");
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingControllers");

const router = express.Router();

router.post("/", createBooking);
router.get("/all", getAllBookings);
router.get("/get/:id", getBookingById);
router.put("/update/:id", updateBookingStatus);
router.delete("/delete/:id", deleteBooking);

module.exports = router;
