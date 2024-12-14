const mongoose = require("mongoose");

const PatientInfoSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
    birthDate: { type: Date, require: true },
    gender: { type: String, require: true },
    address: { type: String, require: true },
    occupation: { type: String, require: true },
    emergencyContactName: { type: String, require: true },
    emergencyContactNumber: { type: String, require: true },
    primaryPhysician: { type: String, require: true },
    insuranceProvider: { type: String, require: true },
    insurancePolicyNumber: { type: String, require: true },
    allergies: { type: String, default: "" },
    currentMedication: { type: String, default: "" },
    familyMedicalHistory: { type: String, default: "" },
    pastMedicalHistory: { type: String, default: "" },
    identificationType: { type: String, default: "" },
    identificationNumber: { type: String, default: "" },
    identificationDocument: { type: String, default: "" },
    treatmentConsent: { type: Boolean, default: false },
    disclosureConsent: { type: Boolean, default: false },
    privacyConsent: { type: Boolean, default: false },
    profilePicture: { type: String, default: "https://github.com/shadcn.png" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "userAuth" },
  },
  { timestamps: true }
);

const PatientInfo = mongoose.model("patientInfo", PatientInfoSchema);

module.exports = PatientInfo;
