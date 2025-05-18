const express = require("express");
const {
  addCleaningService,
  getAllCleaningServices,
  getCleaningService,
  updateCleaningService,
  deleteCleaningService,
} = require("../controllers/cleaningServiceController");

const upload = require("../middleware/upload");

const router = express.Router();

router.post("/add", upload.single("image"), addCleaningService);
router.put("/:id", upload.single("image"), updateCleaningService);

router.get("/", getAllCleaningServices);
router.get("/:id", getCleaningService);
router.delete("/:id", deleteCleaningService);

module.exports = router;
