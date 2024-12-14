const express = require("express");
const {
  createNewAppointment,
  getAppointmentDetails,
  getAllAppointments,
  updateAppointment,
  cancelAppointment,
  getAppointmentById,
  getPatientInfo,
  editPatientInfo,
  deleteAppointment,
  editAppointment,
} = require("../controller/patientInfo");
const protect = require("../middleware/auth");

const router = express.Router();

router.get("/patientInfo/:id", getPatientInfo);
router.get("/appointment/:id", getAppointmentDetails);
router.post("/newAppointment/:userId", createNewAppointment);
router.get("/getAllAppointments/:hospitalId", getAllAppointments);
router.patch("/updateAppointment/:id", updateAppointment);
router.patch("/cancelAppointment/:id", cancelAppointment);
router.get("/getAppointmentById/:id", getAppointmentById);
router.delete("/deleteAppointment/:id", deleteAppointment);
router.put("/editAppointment/:id", protect, editAppointment);

module.exports = router;
