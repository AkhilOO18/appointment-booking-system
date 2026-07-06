const mongoose = require("mongoose");

// A "Service" is whatever people book: a haircut, a doctor consultation,
// a table, a repair slot, etc. Rename the concept in the UI, not the schema.
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    durationMinutes: { type: Number, required: true, default: 30 },
    price: { type: Number, required: true, default: 0 },
    provider: { type: String, default: "" }, // e.g. staff/doctor name handling this service
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
