const mongoose = require("mongoose");
const Course = require("../models/courseModel");
const Module = require("../models/moduleModel");
const Lesson = require("../models/lessonModel");
const {generateCourseOutline} = require("../services/aiService");

// POST /api/courses/generate
// Private
async function generateCourse(req, res) {
  const {topic} = req.body;
  const userId = req.user?.sub; // set by auth middleware

  if (!topic?.trim()) {
    return res.status(400).json({success: false, message: "Topic is required"});
  }
  if (!userId) {
    return res
      .status(401)
      .json({success: false, message: "User not authenticated"});
  }

  try {
    let outline;
    try {
      // Call the new AI service with options
      outline = await generateCourseOutline(topic, {
        targetAudience: "beginner", // We can make this dynamic later
      });
    } catch (aiError) {
      console.error("AI Outline generation failed, using fallback:", aiError);
      // Your team's robust fallback
      outline = {
        title: topic.trim(),
        description: `Auto-generated course on ${topic}`,
        modules: [
          {
            title: "Introduction",
            description: "Welcome to the course",
            lessons: [{title: "Welcome & Setup", description: "Get started"}],
          },
        ],
        prerequisites: [],
        learningOutcomes: ["Learn the basics"],
        targetAudience: "beginner",
      };
    }

    const moduleIds = [];
    for (const m of outline.modules || []) {
      const lessonIds = [];
      for (const l of m.lessons || []) {
        const lesson = await Lesson.create({
          title: l.title,
          description: l.description, // <-- NEW: Save lesson description
          content: [], // Content is still generated lazily
        });
        lessonIds.push(lesson._id);
      }
      const mod = await Module.create({
        title: m.title,
        description: m.description, // <-- NEW: Save module description
        lessons: lessonIds,
      });
      moduleIds.push(mod._id);
    }

    // Create the course with all the new, rich data
    const newCourse = await Course.create({
      title: outline.title,
      description: outline.description,
      targetAudience: outline.targetAudience, // <-- NEW
      prerequisites: outline.prerequisites, // <-- NEW
      learningOutcomes: outline.learningOutcomes, // <-- NEW
      modules: moduleIds,
      creator: userId,
    });

    // Your team's population logic is perfect
    const populated = await Course.findById(newCourse._id).populate({
      path: "modules",
      populate: {path: "lessons", model: "Lesson"},
    });

    return res.status(201).json({success: true, data: populated});
  } catch (error) {
    console.error("Error in generateCourse:", error);
    // This will catch any validation errors if the schemas aren't updated
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation Error",
          errors: error.errors,
        });
    }
    return res.status(500).json({success: false, message: "Server error"});
  }
}

async function getMyCourses(req, res) {
  try {
    const userId = req.user?.sub;
    const courses = await Course.find({creator: userId})
      .populate({path: "modules", populate: {path: "lessons", model: "Lesson"}})
      .sort({createdAt: -1});
    return res.status(200).json({success: true, data: courses});
  } catch (error) {
    console.error("Error in getMyCourses:", error);
    return res.status(500).json({success: false, error: "Server Error"});
  }
}

async function getCourseById(req, res) {
  try {
    const {id} = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({success: false, message: "Invalid course id"});
    }
    const course = await Course.findById(id).populate({
      path: "modules",
      populate: {path: "lessons", model: "Lesson"},
    });
    if (!course) {
      return res
        .status(404)
        .json({success: false, message: "Course not found"});
    }
    return res.status(200).json({success: true, data: course});
  } catch (error) {
    console.error("Error in getCourseById:", error);
    return res.status(500).json({success: false, error: "Server Error"});
  }
}

module.exports = {
  generateCourse,
  getMyCourses,
  getCourseById,
};
