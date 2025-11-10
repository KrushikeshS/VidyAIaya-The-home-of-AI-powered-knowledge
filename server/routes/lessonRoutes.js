const express = require("express");
const Lesson = require("../models/lessonModel");
const Module = require("../models/moduleModel");
const Course = require("../models/courseModel");
const {generateLessonContent} = require("../services/aiService");
const router = express.Router();

// @desc    Get a single lesson by its ID
//          (and generate content if it doesn't exist)
// @route   GET /api/lessons/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    let lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({success: false, error: "Lesson not found"});
    }

    // --- LAZY GENERATION LOGIC ---
    if (!lesson.content || lesson.content.length === 0) {
      console.log(`Content for '${lesson.title}' is empty. Generating...`);

      // 1. Find the context (Module and Course)
      const module = await Module.findOne({lessons: req.params.id});
      const course = await Course.findOne({modules: module._id});

      const moduleTitle = module ? module.title : "";
      const courseTitle = course ? course.title : "";
      const targetAudience = course ? course.targetAudience : "beginner";

      // 2. Generate new content with all the context
      const aiContent = await generateLessonContent(
        lesson.title,
        lesson.description,
        moduleTitle,
        courseTitle,
        {targetAudience: targetAudience}
      );

      try {
        // 3. Update the lesson in the database
        lesson.content = aiContent.content;
        await lesson.save();
        console.log("Content generated and saved.");
      } catch (e) {
        if (e.name === "VersionError") {
          console.log(
            "VersionError: Another request already saved. Fetching new content."
          );
          lesson = await Lesson.findById(req.params.id);
        } else {
          // This is where your error is happening!
          console.error("Error saving lesson:", e);
          throw e; // Re-throw to be caught by the outer block
        }
      }
    }
    // --- End of logic ---

    res.status(200).json({success: true, data: lesson});
  } catch (error) {
    // This will now catch the validation error from above
    console.error("Error in getLessonById:", error);
    res.status(500).json({success: false, error: "Server Error"});
  }
});

module.exports = router;
