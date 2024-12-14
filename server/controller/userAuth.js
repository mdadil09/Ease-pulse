const Token = require("../models/token");
const UserAuth = require("../models/userAuth");
const { requestPasswordReset, resetPassword } = require("../services/auth");
const generateOtp = require("../utils/generateOtp");
const generateToken = require("../utils/generateToken");
const { client } = require("../utils/redis");
const { createMessage } = require("../utils/twilio");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const phoneNumber = await UserAuth.findOne({ phone });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (phoneNumber) {
      return res.status(409).send({ message: "User already exist" });
    }

    const otp = generateOtp();

    await client.set(
      phone,
      JSON.stringify({ otp, name, email, phone, hashedPassword })
    );

    await createMessage(phone, otp);

    res.status(200).send({
      message: "Otp Sent",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const storedData = await client.get(phone);

    console.log(storedData);

    if (!storedData) {
      return res.status(400).send({ message: "Invalid or expired OTP" });
    }

    const {
      otp: storedOtp,
      name,
      email,
      hashedPassword,
    } = JSON.parse(storedData);

    if (otp !== storedOtp) {
      return res.status(400).send({ message: "Invalid OTP" });
    }

    const newUser = await UserAuth.create({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
      role: "USER",
    });

    await client.del(phone);

    res.status(200).send({
      user: newUser,
      token: generateToken(newUser._id, newUser.role),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await UserAuth.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        res.status(401).send({ message: "Password is wrong" });
      } else {
        res.status(200).send({
          user: user,
          token: generateToken(user._id, user.role),
          message: "LoggedIn Successfully!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await UserAuth.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ message: "Password did not match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await UserAuth.updateOne(
      { _id: user._id },
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

const requestPasswordResetController = async (req, res) => {
  try {
    const email = req.body.email;

    console.log(email);

    const user = await UserAuth.findOne({ email });

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
  register,
  verifyOtp,
  login,
  updatePassword,
  requestPasswordResetController,
  resetPasswordController,
};
