const WallfixService = require("../models/WallfixService");

// Add Cleaning Service
const addWallfixService = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const service = new WallfixService({ name, description, price });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Cleaning Services
const getAllWallfixService = async (req, res) => {
  try {
    const services = await WallfixService.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Cleaning Service
const getWallfixService = async (req, res) => {
  try {
    const service = await WallfixService.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Cleaning Service
const updateWallfixService = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const service = await WallfixService.findByIdAndUpdate(
      req.params.id,
      { name, description, price },
      { new: true }
    );
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Cleaning Service
const deleteWallfixService = async (req, res) => {
  try {
    const service = await WallfixService.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addWallfixService,
  getWallfixService,
  getAllWallfixService,
  updateWallfixService,
  deleteWallfixService,
};
