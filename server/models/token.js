const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "userAuth",
  },
  token: { type: String, require: true },
  createdAt: { type: Date, default: Date.now, expiresIn: 3600 },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
