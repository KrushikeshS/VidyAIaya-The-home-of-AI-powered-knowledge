const Course = require("../models/courseModel");
const Module = require("../models/moduleModel");
const Lesson = require("../models/lessonModel");
// Import the specific function we need
const {generateCourseOutline} = require("../services/aiService");

// @desc    Generate a new course (OUTLINE ONLY)
// @route   POST /api/courses/generate
// @access  Private (will be)
exports.generateCourse = async (req, res) => {
  const {topic} = req.body;

  if (!topic) {
    return res.status(400).json({success: false, error: "Topic is required"});
  }

  try {
    // 1. Call the new OUTLINE generator
    const aiData = await generateCourseOutline(topic);

    let moduleIds = [];

    for (const moduleData of aiData.modules) {
      let lessonIds = [];

      for (const lessonData of moduleData.lessons) {
        // 2. Create lessons with ONLY a title and empty content
        const newLesson = await Lesson.create({
          title: lessonData.title,
          content: [], // This is the key change!
        });
        lessonIds.push(newLesson._id);
      }

      const newModule = await Module.create({
        title: moduleData.title,
        lessons: lessonIds,
      });
      moduleIds.push(newModule._id);
    }

    const newCourse = await Course.create({
      title: aiData.title,
      description: aiData.description,
      modules: moduleIds,
      creator: "temp_user_id", // Placeholder
    });

    // Populate and send back
    const populatedCourse = await Course.findById(newCourse._id).populate({
      path: "modules",
      populate: {
        path: "lessons",
        model: "Lesson",
      },
    });

    res.status(201).json({success: true, data: populatedCourse});
  } catch (error) {
    console.error("Error in generateCourse controller:", error);
    res.status(500).json({success: false, error: "Server Error"});
  }
};

// @desc    Get a single course by its ID
// @route   GET /api/courses/:id
// @access  Public (for now)
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: "modules",
      populate: {
        path: "lessons",
        model: "Lesson",
      },
    });

    if (!course) {
      return res.status(404).json({success: false, error: "Course not found"});
    }

    res.status(200).json({success: true, data: course});
  } catch (error) {
    console.error("Error in getCourseById:", error);
    res.status(500).json({success: false, error: "Server Error"});
  }
};
