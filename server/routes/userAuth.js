const express = require("express");
const {
  register,
  verifyOtp,
  login,
  updatePassword,
  requestPasswordResetController,
  resetPasswordController,
} = require("../controller/userAuth");
const protect = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/verifyotp", verifyOtp);
router.post("/login", login);
router.patch("/updatePassword", protect, updatePassword);
router.post("/requestPasswordReset", requestPasswordResetController);
router.post("/resetPassword", resetPasswordController);

module.exports = router;
