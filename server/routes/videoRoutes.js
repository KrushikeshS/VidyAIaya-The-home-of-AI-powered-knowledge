const express = require("express");
const {searchYouTube} = require("../controllers/videoController");

// This is your team's auth middleware, adjust path if needed
const checkJwt = require("../middleware/authMiddleware");

const router = express.Router();

// Protect the route so only logged-in users can use our API key
router.route("/search").get(checkJwt, searchYouTube);

module.exports = router;
