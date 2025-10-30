const express = require("express");
const Lesson = require("../models/lessonModel");

const router = express.Router();

// @desc    Get a single lesson by its ID
// @route   GET /api/lessons/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({success: false, error: "Lesson not found"});
    }
    res.status(200).json({success: true, data: lesson});
  } catch (error) {
    console.error("Error in getLessonById:", error);
    res.status(500).json({success: false, error: "Server Error"});
  }
});

module.exports = router;
