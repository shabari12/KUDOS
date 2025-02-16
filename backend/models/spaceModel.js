const { model } = require("mongoose");

const spaceSchema = new mongoose.Schema({
  spaceName: {
    type: String,
    required: true,
  },
  spaceLogo: {
    type: String,
    required: true,
    default: "",
  },
  headerTitle: {
    type: String,
    required: true,
  },
  customMessage: {
    type: String,
    required: true,
  },
  Questions: {
    type: [String],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  CollectStarRating: {
    type: Boolean,
    default: false,
  },
});

const Space = mongoose.model("Space", spaceSchema);

module.exports = Space;
