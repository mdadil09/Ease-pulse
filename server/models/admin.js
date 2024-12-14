const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true, unique: true },
    hospital: { type: String, require: true },
    image: { type: String, default: "" },
    location: { type: String, default: "" },
  },
  { timestamps: true }
);

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
