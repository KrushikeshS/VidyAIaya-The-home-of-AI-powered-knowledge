// server/routes/courseRoutes.js
const express = require("express");
const router = express.Router();

const checkJwt = require("../middleware/authMiddleware"); // 👈 default export (a function)
const controller = require("../controllers/courseController"); // import the whole module

// Runtime asserts to catch bad imports immediately
// console.log("[routes] typeof checkJwt:", typeof checkJwt);
// console.log(
//   "[routes] typeof generateCourse:",
//   typeof controller.generateCourse
// );
// console.log("[routes] typeof getCourseById:", typeof controller.getCourseById);
// console.log("[routes] typeof getMyCourses:", typeof controller.getMyCourses);

if (typeof checkJwt !== "function")
  throw new Error("checkJwt is not a function export");
if (typeof controller.generateCourse !== "function")
  throw new Error("generateCourse is not a function export");
if (typeof controller.getCourseById !== "function")
  throw new Error("getCourseById is not a function export");
if (typeof controller.getMyCourses !== "function")
  throw new Error("getMyCourses is not a function export");

// Wrap to ensure a function is always passed (even if future refactors change signature)
const use = (mw) => (req, res, next) => mw(req, res, next);

router.post("/generate", use(checkJwt), controller.generateCourse);
router.get("/my-courses", use(checkJwt), controller.getMyCourses);
router.get("/:id", use(checkJwt), controller.getCourseById);

module.exports = router;
