const express = require("express");
const Service = require("../models/Service");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// GET /api/services - anyone can view active services (no login required)
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch services", error: error.message });
  }
});

// GET /api/services/all - admin view, includes inactive ones too
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch services", error: error.message });
  }
});

// POST /api/services - admin only, add a new bookable service
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, durationMinutes, price, provider } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Service name is required" });
    }
    const service = await Service.create({ name, description, durationMinutes, price, provider });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Could not create service", error: error.message });
  }
});

// PUT /api/services/:id - admin only, edit a service
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Could not update service", error: error.message });
  }
});

// DELETE /api/services/:id - admin only
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete service", error: error.message });
  }
});

module.exports = router;
