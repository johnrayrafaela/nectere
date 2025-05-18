const express = require("express");
const { verifyAdmin } = require("../middleware/authMiddleware");
const { addCleaningService, getCleaningServices } = require("../controllers/cleaningServiceController");

const router = express.Router();

// Only Admin can add services
router.post("/cleaning-services/add", verifyAdmin, addCleaningService);

// Everyone can view services
router.get("/cleaning-services", getCleaningServices);

module.exports = router;
