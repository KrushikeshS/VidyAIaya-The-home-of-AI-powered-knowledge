const mongoose = require("mongoose");

// This is a schema for individual blocks of content *within* a lesson
const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    // Add all the new types from your AI prompt
    enum: [
      "text",
      "code",
      "video",
      "quiz",
      "heading", // <-- New
      "list", // <-- New
      "callout", // <-- New
      "exercise", // <-- New
    ],
  },
  content: {
    // This is the key: Mixed allows it to be a String OR an Array
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  // --- Optional fields for specific types ---
  language: {
    type: String, // for 'code'
  },
  options: [String], // for 'quiz'
  correctAnswer: {
    type: String, // for 'quiz'
  },
  explanation: {
    type: String, // for 'quiz'
  },
  calloutType: {
    type: String, // for 'callout' (e.g., "info", "warning")
  },
  listType: {
    type: String, // for 'list' (e.g., "bullet", "numbered")
  },
  hint: {
    type: String, // for 'exercise'
  },
});

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lesson title is required"],
    },
    // The new outline prompt adds a description
    description: {
      type: String,
    },
    content: [contentBlockSchema], // An array of content blocks
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lesson", lessonSchema);
