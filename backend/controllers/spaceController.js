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
    const space = new spaceModel({
      spaceName,
      spaceLogo: req.file.buffer,
      headerTitle,
      customMessage,
      Questions,
      createdBy: req.user._id,
      CollectStarRating,
    });
    await space.save();

    // Update the user document to include the new space's ID
    await userModel.findByIdAndUpdate(req.user._id, {
      $push: { spaces: space._id },
    });

    return res.status(201).json({ msg: "Space created successfully" });
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
    spaceName,
    headerTitle,
    customMessage,
    Questions,
    CollectStarRating,
  } = req.body;
  try {
    const space = await spaceModel.findOne({
      spaceName: req.body.spaceName,
      createdBy: req.user._id,
    });
    if (!space) {
      return res.status(404).json({ msg: "Space not found" });
    }
    space.spaceName = spaceName;
    space.headerTitle = headerTitle;
    space.customMessage = customMessage;
    space.Questions = Questions;
    space.CollectStarRating = CollectStarRating;
    if (req.file) {
      space.spaceLogo = req.file.buffer;
    }
    await space.save();
    return res.status(200).json({ msg: "Space updated successfully" });
  } catch (error) {
    console.error("Error updating space:", error);
    return res.status(500).json({ msg: "Failed to update space" });
  }
};
const getSpace = async (req, res) => {
  const spaceName = req.body.spaceName;
  try {
    const space = await spaceModel.findOne({
      spaceName: spaceName,
      createdBy: req.user._id,
    });
    if (!space) {
      return res.status(404).json({ msg: "Space not found" });
    }
    return res.status(200).json({ space });
  } catch (error) {
    console.error("Error getting space:", error);
    return res.status(500).json({ msg: "Failed to get space" });
  }
};
const getAllSpaces = async (req, res) => {
  try {
    const spaces = await spaceModel.find({ createdBy: req.user._id });
    return res.status(200).json({ spaces });
  } catch (error) {
    console.error("Error getting all spaces:", error);
    return res.status(500).json({ msg: "Failed to get all spaces" });
  }
};

const deleteSpace = async (req, res) => {
  const spaceName = req.body.spaceName;
  try {
    const space = await spaceModel.findOneAndDelete({
      spaceName: spaceName,
      createdBy: req.user._id,
    });
    if (!space) {
      return res.status(404).json({ msg: "Space not found" });
    }
  } catch (error) {
    console.error("Error deleting space:", error);
    return res.status(500).json({ msg: "Failed to delete space" });
  }
};
module.exports = { createSpace, updateSpace, getSpace, deleteSpace,getAllSpaces };