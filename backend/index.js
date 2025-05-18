require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");


const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Import routes
const cleaningServiceRoutes = require("./routes/cleaningServiceRoutes");
app.use("/api/cleaning-services", cleaningServiceRoutes);
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);
const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/employees', employeeRoutes);
const wallfixRoutes = require("./routes/wallfixRoutes");
app.use("/api/wallfix-services", wallfixRoutes);
// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));




// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
