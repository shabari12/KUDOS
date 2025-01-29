const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/userController");
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  userController.registerUser
);

router.post(
  "/verify-otp",
  [body("otp").isLength({ min: 4 }).withMessage("OTP must be 4 digits")],
  userController.verifyUser
);

module.exports = router;
