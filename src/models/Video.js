// create a video model for CRUD
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true, maxlength: 80 },
  fileUrl: { type: String, required: true },
  description: {
    type: String,
    trim: true,
    required: true,
    maxlength: 140,
    minlength: 10,
  },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId /** Only For Mongoose */,
    required: true,
    ref: "User",
  },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

/*
videoSchema.pre("save", async function () {
  this.hashtags = this.hashtags[0]
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});
*/
const movieModel = mongoose.model("Video", videoSchema);

export default movieModel;
