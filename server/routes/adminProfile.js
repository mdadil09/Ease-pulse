const express = require("express");
const {
  getAdminData,
  getAllAdminData,
  getAdminByHospitalName,
} = require("../controller/admin");
const protect = require("../middleware/auth");

const router = express.Router();

router.get("/allAdmin", protect, getAllAdminData);
router.get("/allAdmin/:hospital", protect, getAdminByHospitalName);
router.get("/:id", protect, getAdminData);

module.exports = router;
