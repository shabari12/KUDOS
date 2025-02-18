const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  email: {
    type: String, // Fix the type from 'email' to 'String'
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  feedbackuserLogo: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  space: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Space",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
