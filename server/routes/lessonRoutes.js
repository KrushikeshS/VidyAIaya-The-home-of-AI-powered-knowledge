const express = require("express");
const Lesson = require("../models/lessonModel");
const Course = require("../models/courseModel"); // We need this
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
    // Check if the content array is empty
    if (!lesson.content || lesson.content.length === 0) {
      console.log(`Content for '${lesson.title}' is empty. Generating...`);

      // Find the course this lesson belongs to
      const course = await Course.findOne({"modules.lessons": req.params.id});
      const courseTitle = course ? course.title : "a technology course"; // Fallback

      // 1. Generate new content from the AI
      const aiContent = await generateLessonContent(lesson.title, courseTitle);

      try {
        // 2. Update the lesson in the database
        // We set the content on the document we already fetched
        lesson.content = aiContent.content;
        await lesson.save(); // This save uses the internal version __v

        console.log("Content generated and saved by this request.");
      } catch (e) {
        if (e.name === "VersionError") {
          // This is NOT a real error. It just means the *other* request
          // won the race and saved the content first.
          console.log(
            "VersionError: Another request already saved. Fetching new content."
          );

          // We simply re-fetch the lesson, which now has the content.
          lesson = await Lesson.findById(req.params.id);
        } else {
          // If it's some other error, re-throw it
          throw e;
        }
      }
    }
    // --- End of logic ---

    // 3. Return the (now populated) lesson
    res.status(200).json({success: true, data: lesson});
  } catch (error) {
    console.error("Error in getLessonById:", error);
    res.status(500).json({success: false, error: "Server Error"});
  }
});

module.exports = router;
