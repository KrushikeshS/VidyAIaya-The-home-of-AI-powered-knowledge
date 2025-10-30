const mongoose = require("mongoose");

// This is a schema for individual blocks of content *within* a lesson
const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["text", "code", "video", "quiz"],
  },
  content: {
    type: String,
    required: true,
  },
  // Optional: for 'code' type
  language: {
    type: String,
  },
  // Optional: for 'quiz' type
  options: [String],
  correctAnswer: {
    type: String,
  },
});

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lesson title is required"],
    },
    content: [contentBlockSchema], // An array of content blocks
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lesson", lessonSchema);
