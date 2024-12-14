const mongoose = require("mongoose");

const UserAuthSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    phone: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    profilePicture: { type: String, default: "https://github.com/shadcn.png" },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  { timestamps: true }
);

const UserAuth = mongoose.model("userAuth", UserAuthSchema);

module.exports = UserAuth;
