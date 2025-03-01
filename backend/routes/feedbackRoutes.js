const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const feedbackController = require("../controllers/feedbackController");
router.post(
  "/submit-feedback/:spaceId",
  upload.single("feedbackuserLogo"),
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("name").notEmpty().withMessage("Name is required"),
    body("feedback").notEmpty().withMessage("Feedback is required"),
    body("rating")
      .notEmpty()
      .isLength({ max: 6 })
      .withMessage("Rating is required"),
  ],
  feedbackController.submitFeedback
);
router.get(
  "/get-feedback",
  [body("spaceId").notEmpty().withMessage("Space ID is required")],
  feedbackController.getFeedback
);


module.exports = router;
