const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");


// Create employee
const bcrypt = require("bcryptjs"); // add at the top if not already

// Create employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, phone, role, password, availability } = req.body;

    if (!name || !email || !phone || !role || !password) {
      return res.status(400).json({ message: "Name, email, phone, role, and password are required" });
    }

    const existing = await Employee.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      name,
      email,
      phone,
      role,
      password: hashedPassword,
      availability: availability !== undefined ? availability : true
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update employee availability or info
exports.updateEmployee = async (req, res) => {
  try {
    const { name, email, phone, role, availability } = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role, availability },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reset all employees' availability and availableUntil
exports.resetAvailability = async (req, res) => {
  try {
    await Employee.updateMany({}, { availability: true, availableUntil: null });
    res.status(200).json({ message: "All employees have been reset to available." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Register employee
exports.registerEmployee = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existing = await Employee.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "employee",
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login employee
exports.loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(400).json({ message: "Employee not found" });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


