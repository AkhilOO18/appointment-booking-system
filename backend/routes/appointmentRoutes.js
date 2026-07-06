const express = require("express");
const Appointment = require("../models/Appointment");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// POST /api/appointments - logged-in user books an appointment
router.post("/", protect, async (req, res) => {
  try {
    const { service, date, time, notes } = req.body;

    if (!service || !date || !time) {
      return res.status(400).json({ message: "Service, date and time are required" });
    }

    // Prevent double-booking the exact same slot for the same service
    const clash = await Appointment.findOne({
      service,
      date,
      time,
      status: { $in: ["pending", "confirmed"] },
    });
    if (clash) {
      return res.status(400).json({ message: "That time slot is already booked. Please choose another." });
    }

    const appointment = await Appointment.create({
      user: req.user.id,
      service,
      date,
      time,
      notes,
    });

    const populated = await appointment.populate("service");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Could not book appointment", error: error.message });
  }
});

// GET /api/appointments/mine - logged-in user's own appointments
router.get("/mine", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate("service")
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch your appointments", error: error.message });
  }
});

// PUT /api/appointments/:id/cancel - user cancels their own appointment
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (appointment.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only cancel your own appointments" });
    }
    appointment.status = "cancelled";
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Could not cancel appointment", error: error.message });
  }
});

// GET /api/appointments - admin only, view every appointment
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("service")
      .populate("user", "name email phone")
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch appointments", error: error.message });
  }
});

// PUT /api/appointments/:id/status - admin updates status (confirm / complete / cancel)
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "cancelled", "completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("service").populate("user", "name email phone");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Could not update appointment", error: error.message });
  }
});

module.exports = router;
