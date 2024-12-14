require("dotenv").config();

const twilio = require("twilio");

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const createMessage = async (phone, otp) => {
  const message = await client.messages.create({
    body: `Your Otp is: ${otp}`,
    from: process.env.TWILIO_NUMBER,
    to: phone,
  });

  console.log(message);
};

module.exports = { createMessage };
