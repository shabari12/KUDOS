const nodemailer = require("nodemailer");
const dotenv = require("dotenv");


dotenv.config();


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, // Sender password from the .env file
  },
});

// Function to send an email
async function sendEmail(receivermail, otp) {
  try {
    // Send mail with the defined transporter
    const info = await transporter.sendMail({
      from: `"Kudos 👻" <${process.env.EMAIL_SENDER}>`, // Sender address
      to: receivermail, // Receiver's email address
      subject: "Verify Your Sign-Up Process", // Subject line
      text: `Your OTP to Sign Up is ${otp}`, // Plain text body
      html: `<p>Your OTP to Sign Up is <strong>${otp}</strong>.</p>`, // HTML body
    });
    console.log("Message sent: %s", info.messageId);

    // Return success response
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

module.exports = sendEmail;
