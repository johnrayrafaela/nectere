// controllers/cleaningServiceController.js

const CleaningService = require("../models/CleaningService");

// Add Cleaning Service
const addCleaningService = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      subcategory,
      shopcategory,
      availability, // <-- can be provided or default to true
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const service = new CleaningService({
      name,
      description,
      price,
      category,
      quantity,
      subcategory,
      shopcategory,
      image,
      availability: availability !== undefined ? availability : true,
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Cleaning Services
const getAllCleaningServices = async (req, res) => {
  try {
    const services = await CleaningService.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Cleaning Service
const getCleaningService = async (req, res) => {
  try {
    const service = await CleaningService.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Cleaning Service
const updateCleaningService = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      subcategory,
      shopcategory,
      availability, // <-- allow updating availability manually if needed
    } = req.body;

    const image = req.file ? req.file.filename : undefined;

    const updatedData = {
      name,
      description,
      price,
      category,
      quantity,
      subcategory,
      shopcategory,
      availability: availability !== undefined ? availability : undefined,
    };

    if (image) updatedData.image = image;

    const service = await CleaningService.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!service) return res.status(404).json({ message: "Service not found" });

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Cleaning Service
const deleteCleaningService = async (req, res) => {
  try {
    const service = await CleaningService.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addCleaningService,
  getAllCleaningServices,
  getCleaningService,
  updateCleaningService,
  deleteCleaningService,
};
