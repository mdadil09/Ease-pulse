const mongoose = require("mongoose");

const DoctorInfoSchema = new mongoose.Schema(
  {
    image: { type: String, default: "" },
    name: { type: String },
    specialization: { type: String },
    price: { type: Number },
    hospitalID: { type: mongoose.Schema.Types.ObjectId, ref: "admins" },
  },
  { timestamps: true }
);

const DoctorInfo = mongoose.model("DoctorInfo", DoctorInfoSchema);

module.exports = DoctorInfo;
