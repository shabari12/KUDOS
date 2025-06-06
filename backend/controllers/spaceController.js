const spaceModel = require("../models/spaceModel");
const userModel = require("../models/userModel");
const { validationResult } = require("express-validator");
const multer = require("multer");
const storage = multer.memoryStorage();
const unique = multer({ storage });
const createSpace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    spaceName,
    headerTitle,
    customMessage,
    Questions,
    CollectStarRating,
  } = req.body;

  try {
    const parsedQuestions = Array.isArray(Questions) ? Questions : JSON.parse(Questions);

    const space = new spaceModel({
      spaceName,
      spaceLogo: req.file.buffer,
      headerTitle,
      customMessage,
      Questions: parsedQuestions, // Ensure it's an array
      createdBy: req.user._id,
      CollectStarRating,
    });

    await space.save();

    // Update user document to include space ID
    await userModel.findByIdAndUpdate(req.user._id, {
      $push: { spaces: space._id },
    });

    return res.status(201).json({ msg: "Space created successfully", space });
  } catch (error) {
    console.error("Error creating space:", error);
    return res.status(500).json({ msg: "Failed to create space" });
  }
};


const updateSpace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    spaceId,
    spaceName,
    headerTitle,
    customMessage,
    Questions,
    CollectStarRating,
  } = req.body;

  try {
    const parsedQuestions = Array.isArray(Questions) ? Questions : JSON.parse(Questions);

    const updateData = {
      spaceName,
      headerTitle,
      customMessage,
      Questions: parsedQuestions, // Ensure it's an array
      CollectStarRating,
    };

    if (req.file) {
      updateData.spaceLogo = req.file.buffer;
    }

    const space = await spaceModel.findByIdAndUpdate(
      spaceId,
      updateData,
      { new: true }
    );

    if (!space) {
      return res.status(404).json({ msg: "Space not found" });
    }

    return res.status(200).json({ msg: "Space updated successfully", space });
  } catch (error) {
    console.error("Error updating space:", error);
    return res.status(500).json({ msg: "Failed to update space" });
  }
};
const getSpace = async (req, res) => {
  const spaceId = req.query.spaceId;
  
  try {
    const space = await spaceModel.findOne({
      _id: spaceId,
      createdBy: req.user._id,
    });

    if (!space) {
      return res.status(404).json({ msg: "Space not found" });
    }

    const formattedSpace = {
      ...space._doc,
      spaceLogo: space.spaceLogo
        ? `data:image/png;base64,${space.spaceLogo.toString("base64")}`
        : null,
      Questions: Array.isArray(space.Questions) ? space.Questions : [], // Ensure it's an array
    };

    return res.status(200).json({ space: formattedSpace });
  } catch (error) {
    console.error("Error getting space:", error);
    return res.status(500).json({ msg: "Failed to get space" });
  }
};


const getAllSpaces = async (req, res) => {
  try {
    const spaces = await spaceModel.find({ createdBy: req.user._id });

    const formattedSpaces = spaces.map((space) => ({
      ...space._doc,
      spaceLogo: space.spaceLogo
        ? `data:image/png;base64,${space.spaceLogo.toString("base64")}`
        : null,
    }));

    res.json({ spaces: formattedSpaces });
  } catch (error) {
    console.error("Error getting all spaces:", error);
    return res.status(500).json({ msg: "Failed to get all spaces" });
  }
};

const deleteSpace = async (req, res) => {
  const spaceId = req.body.spaceId;

  try {
    const space = await spaceModel.findOneAndDelete({
      _id: spaceId,
      createdBy: req.user._id,
    });
    if (!space) {
      return res.status(404).json({ msg: "Space not found" });
    }
    return res.status(200).json({ msg: "Space deleted successfully" });
  } catch (error) {
    console.error("Error deleting space:", error);
    return res.status(500).json({ msg: "Failed to delete space" });
  }
};
module.exports = {
  createSpace,
  updateSpace,
  getSpace,
  deleteSpace,
  getAllSpaces,
};
