const admins = require("../db/adminData");
const Admin = require("../models/admin");
const Token = require("../models/token");
const {
  requestPasswordReset,
  resetPassword,
} = require("../services/authAdmin");
const generateToken = require("../utils/generateToken");
const { hashedPasswordForAdmins } = require("../utils/hashedAdmins");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");

const adminRegister = async (req, res) => {
  try {
    const hashedAdmins = await hashedPasswordForAdmins(admins);
    const result = await Admin.insertMany(hashedAdmins);

    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminExist = await Admin.findOne({ email: email });

    if (!adminExist) {
      return res.status(404).send({ message: "Email Id is wrong" });
    }

    const validPassword = await bcrypt.compare(password, adminExist.password);
    if (!validPassword) {
      return res.status(400).send({
        message: "Password is wrong",
      });
    }

    res.status(200).send({
      admin: adminExist,
      token: generateToken(adminExist._id, "ADMIN"),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error!" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const admin = await Admin.findOne({ email: email });

    if (!admin) {
      return res.status(404).send({ message: "Password did not match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await Admin.updateOne(
      { _id: admin._id },
      { $set: { password: hash } },
      { new: true }
    );

    res.status(200).send({
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

const getAllAdminData = async (req, res) => {
  try {
    const adminExist = await Admin.find();

    if (!adminExist) {
      return res.status(404).send({ message: "Admin not found" });
    }

    res.status(200).send({
      admin: adminExist,
      message: "Admin found",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

const getAdminData = async (req, res) => {
  try {
    const id = req.params.id;

    const adminExist = await Admin.findOne({ _id: id });

    if (!adminExist) {
      return res.status(404).send({ message: "Admin not found" });
    }

    res.status(200).send({
      admin: adminExist,
      message: "Admin found",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

const getAdminByHospitalName = async (req, res) => {
  try {
    const hospitalName = req.params.hospital;
    const adminExist = await Admin.find({ hospital: hospitalName });

    if (!adminExist) {
      return res.status(404).send({ message: "Admin not found" });
    }

    res.status(200).send({
      admin: adminExist,
      message: "Admin found",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

const updateAdminInfo = async (req, res) => {
  try {
    const id = req.params.id;

    const profilePicture = req.file ? req.file.path : undefined;
    const objectId = new mongoose.Types.ObjectId(id);

    const adminInfo = await Admin.findOneAndUpdate(
      {
        _id: objectId,
      },
      {
        $set: {
          image: profilePicture,
        },
      },
      { new: true }
    );

    if (!adminInfo) {
      return res.status(404).send({ message: "Admin doesn't exist" });
    }

    res.status(200).send({
      adminInfo: adminInfo,
      message: "Admin info updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

const requestPasswordResetController = async (req, res) => {
  try {
    const email = req.body.email;

    console.log(email);

    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const requestPasswordResetService = await requestPasswordReset(email);

    return res.status(200).send(requestPasswordResetService);
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error.message);
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const userId = req.body.userId;
    const token = req.body.token;
    const password = req.body.newPassword;

    console.log(userId, token);

    let passwordResetToken = await Token.findOne({ userId });
    const resetPasswordService = await resetPassword(userId, token, password);

    if (!passwordResetToken) {
      return res.status(404).send({ message: "Token not found or expired" });
    }
    return res.status(200).send(resetPasswordService);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  adminRegister,
  adminLogin,
  updatePassword,
  getAdminData,
  updateAdminInfo,
  requestPasswordResetController,
  resetPasswordController,
  getAllAdminData,
  getAdminByHospitalName,
};
