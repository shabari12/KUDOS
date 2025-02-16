const model = require("mongoose").model;

const feedbackSchema = new mongoose.Schema({
  email: {
    type: email,
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
