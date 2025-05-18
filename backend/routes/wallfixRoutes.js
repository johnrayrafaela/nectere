const express = require("express");
const {
  addWallfixService,
  getAllWallfixService,
  getWallfixService,
  updateWallfixService,
  deleteWallfixService,
} = require("../controllers/wallfixController");

const router = express.Router();

router.post("/add", addWallfixService);
router.get("/", getAllWallfixService);
router.get("/:id", getWallfixService);
router.put("/:id", updateWallfixService);
router.delete("/:id", deleteWallfixService);

module.exports = router;
