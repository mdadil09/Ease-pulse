const express = require("express");
const {
  getDoctor,
  deleteDoctor,
  getSingleDoctor,
  getDoctorByHospital,
} = require("../controller/doctor");
const protect = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getDoctor);
router.get("/:id", protect, getSingleDoctor);
router.get("/doctorByHospital/:id", protect, getDoctorByHospital);
router.delete("/deleteDoctor/:id", protect, deleteDoctor);

module.exports = router;
