const spaceModel = require("../models/spaceModel");
const feedbackModel = require("../models/feedbackModel");
const { validationResult } = require("express-validator");

const submitFeedback = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, name, rating, permission,feedback } = req.body;
  const { spaceId } = req.params;



  try {
    const space = await spaceModel.findById(spaceId);
    if (!space) {
      return res.status(404).json({ msg: "Space not found" });
    }

    const feedbacksave = new feedbackModel({
      email,
      name,
      feedbackuserLogo: req.file.buffer,
      feedback,
      rating,
      permission, 
      space: space._id,
    });

    await feedbacksave.save();

    return res.status(201).json({ msg: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return res.status(500).json({ msg: "Failed to submit feedback" });
  }
};

const getFeedback = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { spaceId } = req.body;

  try {
    const space = await spaceModel.findById(spaceId);
    if (!space) {
      return res.status(404).json({ msg: "Space not found" });
    }

    const feedbacks = await feedbackModel.find({ space: space._id });

    
    const formattedFeedbacks = feedbacks.map((feedback) => ({
      ...feedback._doc,
      feedbackuserLogo: feedback.feedbackuserLogo
        ? `data:image/png;base64,${feedback.feedbackuserLogo.toString("base64")}`
        : null,
      
    }));

    return res.status(200).json({ feedbacks: formattedFeedbacks });
  } catch (error) {
    console.error("Error getting feedback:", error);
    return res.status(500).json({ msg: "Failed to get feedback" });
  }
};

module.exports = {
  submitFeedback,
  getFeedback,
};