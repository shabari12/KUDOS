const crypto = require("crypto");
const userModel = require("../models/userModel");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/nodemailer");
const userService = require("../services/userService");

const hashOtp = (email, otp) => {
  const secret = process.env.OTP_SECRET || "your-secret-key";
  return crypto
    .createHmac("sha256", secret)
    .update(email + otp)
    .digest("hex");
};

const otpStore = new Map(); // Temporary storage for OTP hashes

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  const isUserExist = await userModel.findOne({ email });
  if (isUserExist) {
    return res.status(400).json({ msg: "User already exists" });
  }

  const otp = Math.floor(1000 + Math.random() * 9000);
  const otpHash = hashOtp(email, otp);
  otpStore.set(email, otpHash); // Store OTP hash temporarily

  try {
    await sendEmail(email, otp);
    console.log("OTP sent to email");
    return res.status(201).json({
      msg: `OTP sent to your email and the otp is ${otp}`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ msg: "Failed to send OTP. Try again later." });
  }
};

const verifyUser = async (req, res) => {
  const { email, otp, username, password } = req.body;
  console.log(req.body);
  const storedHash = otpStore.get(email);
  if (!storedHash) {
    return res.status(400).json({ msg: "OTP expired or invalid" });
  }

  const expectedHash = hashOtp(email, otp);
  if (expectedHash !== storedHash) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  otpStore.delete(email); // Remove OTP after successful verification

  const hashedPassword = await userModel.hashPassword(password);
  const newUser = new userModel({ username, email, password: hashedPassword }); // Correctly assign the hashed password

  await newUser.save();

  const token = newUser.generateAuthToken();

  return res.status(200).json({
    newUser,
    msg: "OTP verified successfully!",
    token,
  });
};

module.exports = { registerUser, verifyUser };
