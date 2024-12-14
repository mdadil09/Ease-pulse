const Token = require("../models/token");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const Admin = require("../models/admin");

const requestPasswordReset = async (email) => {
  try {
    const user = await Admin.findOne({ email });

    if (!user) {
      throw new Error("User Doesn't exist");
    }
    const name = user.hospital;

    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();
    let resetToken = crypto.randomBytes(32).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(resetToken, salt);

    const newToken = await Token.create({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    });

    const link = `${process.env.CLIENT_URL}/admin/forgot-password/reset?token=${resetToken}&id=${user._id}`;
    const htmlContent = `
      <h1>Hi, ${name}</h1>
      <p>You requested to reset your password.</p>
      <p>Please, click the link below to reset your password.</p>
      <a href="${link}">Reset Password</a>`;
    sendEmail(`${email}`, "Request to reset password", htmlContent);
    return link;
  } catch (error) {
    console.log(error.message);
  }
};

const resetPassword = async (userId, token, password) => {
  try {
    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token");
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid) {
      throw new Error("Invalid or expired password reset token");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await Admin.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );

    const user = await Admin.findById({ _id: userId });
    const name = user.hospital;

    const htmlContent = `<h1>Hi, ${name}</h1>
      <p>Your password reset successfully.</p>`;

    sendEmail(user.email, "Password Reset Successfully", htmlContent);
    await passwordResetToken.deleteOne();
    return "Password Reset Successfully";
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { requestPasswordReset, resetPassword };
