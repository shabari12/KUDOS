const express = require("express");
const { route } = require("./userRoutes");
const router = express.Router();
const { body } = require("express-validator");
const { createSpace } = require("../controllers/spaceController");
const spaceController = require("../controllers/spaceController");
const { Collection } = require("mongoose");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const userMiddleware = require("../middlewares/userMiddleware");

router.post(
  "/create-space",
  userMiddleware.authUser,
  upload.single("SpaceLogo"),
  [
    body("spaceName").notEmpty().withMessage("Space Name is required"),

    body("headerTitle").notEmpty().withMessage("Header Title is required"),
    body("customMessage").notEmpty().withMessage("Custom Message is required"),
    body("Questions").notEmpty().withMessage("Questions is required"),

    body("CollectStarRating")
      .notEmpty()
      .withMessage("Collect Star Rating is required"),
  ],
  spaceController.createSpace
);
router.post(
  "/update-space",
  userMiddleware.authUser,
  upload.single("SpaceLogo"),
  [
    body("spaceName").notEmpty().withMessage("Space Name is required"),

    body("headerTitle").notEmpty().withMessage("Header Title is required"),
    body("customMessage").notEmpty().withMessage("Custom Message is required"),
    body("Questions").notEmpty().withMessage("Questions is required"),

    body("CollectStarRating")
      .notEmpty()
      .withMessage("Collect Star Rating is required"),
  ],
  spaceController.updateSpace
);
router.get(
  "/get-space",
  userMiddleware.authUser,
  [body("spaceName").notEmpty().withMessage("Space Name is required")],
  spaceController.getSpace
);
router.get(
  "/get-all-spaces",
  userMiddleware.authUser,
  spaceController.getAllSpaces
);
router.post(
  "/delete-space",
  userMiddleware.authUser,
  [body("spaceName").notEmpty().withMessage("Space Name is required")],
  spaceController.deleteSpace
);

module.exports = router;
