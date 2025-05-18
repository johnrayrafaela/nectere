const express = require("express");
const {
  registerEmployee,
  loginEmployee,
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  resetAvailability
} = require("../controllers/employeeController");

const router = express.Router();

router.post("/register", registerEmployee);
router.post("/login", loginEmployee);
router.put("/reset-availability", resetAvailability);
router.post("/", createEmployee); // Optional if you register via UI
router.get("/", getAllEmployees);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;
