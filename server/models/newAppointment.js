const mongoose = require("mongoose");

const NewAppointmentSchema = new mongoose.Schema(
  {
    primaryPhysician: { type: String, required: true },
    schedule: { type: Date, required: true },
    reason: { type: String, require: true },
    note: { type: String, default: "" },
    cancellationReason: { type: String, default: "" },
    status: { type: String, default: "pending" },
    paymentStatus: { type: String, default: "" },
    paymentMode: { type: String, default: "offline" },
    hospital: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "userAuth" },
  },
  { timestamps: true }
);

const NewAppointment = mongoose.model("newAppointment", NewAppointmentSchema);

module.exports = NewAppointment;
