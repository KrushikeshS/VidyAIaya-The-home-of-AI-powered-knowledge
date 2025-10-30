const express = require("express");
const {
  generateCourse,
  getCourseById,
} = require("../controllers/courseController");

const router = express.Router();

router.route("/generate").post(generateCourse);
router.route("/:id").get(getCourseById);

module.exports = router;
