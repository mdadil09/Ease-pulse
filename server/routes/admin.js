const express = require("express");
const {
  adminLogin,
  updatePassword,
  getAdminData,
  requestPasswordResetController,
  resetPasswordController,
} = require("../controller/admin");
const protect = require("../middleware/auth");

const router = express.Router();
router.post("/login", adminLogin);
router.post("/updatePassword", protect, updatePassword);
router.post("/requestPasswordReset", requestPasswordResetController);
router.post("/resetPassword", resetPasswordController);

module.exports = router;
