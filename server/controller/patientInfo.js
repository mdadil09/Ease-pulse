const { default: mongoose } = require("mongoose");
const Admin = require("../models/admin");
const DoctorInfo = require("../models/doctor");
const NewAppointment = require("../models/newAppointment");
const PatientInfo = require("../models/patientInfo");
const UserAuth = require("../models/userAuth");
const { parseDate, formatDate } = require("../utils/config");
const { ObjectId } = require("mongodb");
const sendEmail = require("../utils/sendEmail");
const { generateEmailTemplate } = require("../email_template/email_template");

const addPatientInformation = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      birthDate,
      gender,
      address,
      occupation,
      emergencyContactName,
      emergencyContactNumber,
      primaryPhysician,
      insuranceProvider,
      insurancePolicyNumber,
      allergies,
      currentMedication,
      familyMedicalHistory,
      pastMedicalHistory,
      identificationType,
      identificationNumber,
      treatmentConsent,
      disclosureConsent,
      privacyConsent,
    } = req.body;

    const id = req.params.id;

    console.log(id);

    const identificationDocument = req.file.path;

    console.log(req.file);

    const createdByUser = await UserAuth.findOne({ phone });
    const userExist = await PatientInfo.findOne({ phone });

    if (userExist) {
      return res.status(409).send({ message: "User already exist" });
    }

    const user = await PatientInfo.create({
      name: name,
      email: email,
      phone: phone,
      birthDate: birthDate,
      gender: gender,
      address: address,
      occupation: occupation,
      emergencyContactName: emergencyContactName,
      emergencyContactNumber: emergencyContactNumber,
      primaryPhysician: primaryPhysician,
      insuranceProvider: insuranceProvider,
      insurancePolicyNumber: insurancePolicyNumber,
      allergies: allergies,
      currentMedication: currentMedication,
      familyMedicalHistory: familyMedicalHistory,
      pastMedicalHistory: pastMedicalHistory,
      identificationType: identificationType,
      identificationNumber: identificationNumber,
      identificationDocument: identificationDocument,
      treatmentConsent: treatmentConsent,
      disclosureConsent: disclosureConsent,
      privacyConsent: privacyConsent,
      createdBy: id,
    });

    res.status(200).send({
      user: user,
      message: "user created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getPatientInfo = async (req, res) => {
  try {
    const id = req.params.id;

    const objectId = new mongoose.Types.ObjectId(id);

    const patientInfo = await PatientInfo.findOne({ createdBy: objectId });

    if (!patientInfo) {
      return res.status(404).send({ message: "Patient doesn't exist" });
    }

    res.status(200).send({
      patientInfo: patientInfo,
      message: "Patient info found successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const editPatientInfo = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      name,
      email,
      phone,
      birthDate,
      address,
      occupation,
      emergencyContactName,
      emergencyContactNumber,
      insuranceProvider,
      insurancePolicyNumber,
      allergies,
      currentMedication,
      familyMedicalHistory,
      pastMedicalHistory,
    } = req.body;

    const profilePicture = req.file ? req.file.path : undefined;

    const objectId = new mongoose.Types.ObjectId(id);

    const patientInfo = await PatientInfo.findOneAndUpdate(
      {
        createdBy: objectId,
      },
      {
        $set: {
          name: name,
          email: email,
          phone: phone,
          birthDate: birthDate,
          address: address,
          occupation: occupation,
          emergencyContactName: emergencyContactName,
          emergencyContactNumber: emergencyContactNumber,
          insuranceProvider: insuranceProvider,
          insurancePolicyNumber: insurancePolicyNumber,
          allergies: allergies,
          currentMedication: currentMedication,
          familyMedicalHistory: familyMedicalHistory,
          pastMedicalHistory: pastMedicalHistory,
          profilePicture: profilePicture,
        },
      },
      { new: true }
    );

    const userInfo = await UserAuth.findOneAndUpdate(
      {
        _id: objectId,
      },
      {
        $set: {
          name: name,
          email: email,
          phone: phone,
          profilePicture: profilePicture,
        },
      },
      { new: true }
    );

    if (!patientInfo && !userInfo) {
      return res.status(404).send({ message: "Patient doesn't exist" });
    }

    res.status(200).send({
      patientInfo: patientInfo,
      user: { user: userInfo },
      message: "Patient info updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const createNewAppointment = async (req, res) => {
  try {
    const {
      primaryPhysician,
      schedule,
      reason,
      note,
      cancellationReason,
      paymentMode,
      hospital,
    } = req.body;
    const userId = req.params.userId;

    console.log(userId);

    if (!userId) {
      return res.status(404).send({ message: "User not exist" });
    }

    const newAppointment = await NewAppointment.create({
      primaryPhysician: primaryPhysician,
      schedule: schedule,
      note: note,
      reason: reason,
      cancellationReason: cancellationReason,
      paymentMode: paymentMode,
      createdBy: userId,
      hospital: hospital,
    });

    const objectId = new mongoose.Types.ObjectId(userId);

    const user = await UserAuth.findOne({ _id: objectId });

    const doctor = await DoctorInfo.findOne({ name: primaryPhysician });

    const admin = await Admin.findOne({ _id: doctor.hospitalID });

    sendEmail(
      user.email,
      "Request to schedule appointment",
      generateEmailTemplate(
        user.name,
        newAppointment,
        admin.location,
        admin.image,
        admin.email
      )
    );

    res.status(200).send({
      newAppointment: newAppointment,
      message: "Appointment Booked Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getAppointmentDetails = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const appointment = await NewAppointment.findOne({ _id: appointmentId });

    if (!appointment) {
      return res.status(404).send({ message: "Appointment doesn't exist" });
    }

    res.status(200).send({
      appointment: appointment,
      message: "Appointment detail successfully fetched",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// const getAllAppointments = async (req, res) => {
//   const hospitalId = req.params.hospitalId;

//   try {
//     const doctors = await DoctorInfo.find({
//       hospitalID: hospitalId,
//     });

//     if (doctors.length === 0) {
//       return res.status(404).send({
//         message: "Hospital doesn't exist or has no associated doctors",
//       });
//     }

//     const physicianNames = doctors.map((item) => item.name);

//     const appointments = await NewAppointment.find({
//       primaryPhysician: { $in: physicianNames },
//     });

//     if (appointments.length === 0) {
//       return res.status(404).send({
//         message: "No appointments found for this hospital",
//       });
//     }

//     const createdByIds = appointments.map(
//       (appointment) => appointment.createdBy
//     );
//     const patients = await PatientInfo.find({
//       createdBy: {
//         $in: createdByIds,
//       },
//     });

//     const patientsByCreatedBy = patients.reduce((acc, patient) => {
//       if (!acc[patient.createdBy]) {
//         acc[patient.createdBy] = [];
//       }
//       acc[patient.createdBy].push(patient);
//       return acc;
//     }, {});

//     console.log("Patients By Created By:", patientsByCreatedBy);

//     const appointmentDetails = appointments.map((appointment) => {
//       console.log("Appointment CreatedBy:", appointment.createdBy);
//       console.log(
//         "Associated Patients:",
//         patientsByCreatedBy[appointment.createdBy.toString()]
//       );

//       console.log("appointment: ", appointment.toObject());

//       return {
//         ...appointment.toObject(),
//         patients:
//           patientsByCreatedBy.createdBy === appointment.createdBy
//             ? patientsByCreatedBy
//             : [],
//       };
//     });
//     res.status(200).send({
//       appointment: appointmentDetails,
//       message: "Appointment detail successfully fetched",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// };

const getAllAppointments = async (req, res) => {
  const hospitalId = req.params.hospitalId;

  try {
    const doctors = await DoctorInfo.find({ hospitalID: hospitalId });

    if (doctors.length === 0) {
      return res.status(404).send({
        message: "Hospital doesn't exist or has no associated doctors",
      });
    }

    const physicianNames = doctors.map((item) => item.name);

    const appointmentDetails = await NewAppointment.aggregate([
      {
        $match: {
          primaryPhysician: { $in: physicianNames },
        },
      },
      {
        $lookup: {
          from: "patientinfos",
          localField: "createdBy",
          foreignField: "createdBy",
          as: "patients",
        },
      },
      {
        $addFields: {
          patients: { $ifNull: ["$patients", []] },
        },
      },
    ]);

    res.status(200).send({
      appointment: appointmentDetails,
      message: "Appointment detail successfully fetched",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const id = req.params.id;

    const { primaryPhysician, schedule, reason, note, status } = req.body;

    console.log("Befor:", status);

    const appointment = await NewAppointment.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          primaryPhysician: primaryPhysician,
          schedule: schedule,
          reason: reason,
          cancellationReason: "",
          note: note,
          status: status,
        },
      },
      { new: true }
    );

    const userId = appointment.createdBy;

    const objectId = new mongoose.Types.ObjectId(userId);

    const user = await UserAuth.findOne({ _id: objectId });

    const doctor = await DoctorInfo.findOne({ name: primaryPhysician });

    const admin = await Admin.findOne({ _id: doctor.hospitalID });

    console.log(appointment.status);

    if (appointment.status === "scheduled") {
      sendEmail(
        user.email,
        "Your appointment has been scheduled",
        generateEmailTemplate(
          user.name,
          appointment,
          admin.location,
          admin.image,
          admin.email
        )
      );
    }

    res.status(200).send({
      appointment: appointment,
      message: "Appointment confirmed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const id = req.params.id;

    const appointment = await NewAppointment.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          cancellationReason: req.body.cancellationReason,
          status: "cancelled",
        },
      },
      { new: true }
    );

    const userId = appointment.createdBy;

    const objectId = new mongoose.Types.ObjectId(userId);

    const user = await UserAuth.findOne({ _id: objectId });

    const doctor = await DoctorInfo.findOne({
      name: appointment.primaryPhysician,
    });

    const admin = await Admin.findOne({ _id: doctor.hospitalID });

    sendEmail(
      user.email,
      "Your appointment has been cancelled",
      generateEmailTemplate(
        user.name,
        appointment,
        admin.location,
        admin.image,
        admin.email
      )
    );

    res.status(200).send({
      appointment: appointment,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const userId = req.params.id;

    const appointment = await NewAppointment.find({ createdBy: userId });

    if (!appointment) {
      return res.status(404).send({ message: "Appointment doesn't exist" });
    }

    res.status(200).send({
      appointment: appointment,
      message: "Appointment detail successfully fetched",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const appointment = await NewAppointment.findOneAndDelete({ _id: id });

    res.status(200).send({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error!" });
  }
};

const editAppointment = async (req, res) => {
  try {
    const id = req.params.id;

    const { status } = req.body;

    console.log(id);

    const appointment = await NewAppointment.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          paymentStatus: status,
        },
      },
      { new: true }
    );

    res.status(200).send({
      appointment: appointment,
      message: "Payment status updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  addPatientInformation,
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
};
