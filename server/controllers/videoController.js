const {google} = require("googleapis");

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

// @desc    Search YouTube for a video
// @route   GET /api/video/search
// @access  Private (must be logged in)
//
// FIX: Define as a const function, instead of attaching to 'exports'
const searchYouTube = async (req, res) => {
  const {query} = req.query; // Get search query from URL (e.g., ?query=react+hooks)

  if (!query) {
    return res
      .status(400)
      .json({success: false, message: "Search query is required"});
  }

  try {
    const response = await youtube.search.list({
      part: "snippet",
      q: query,
      type: "video",
      maxResults: 1, // We just want the top result
    });

    if (response.data.items && response.data.items.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      res.status(200).json({success: true, videoId: videoId});
    } else {
      res.status(404).json({success: false, message: "No videos found"});
    }
  } catch (error) {
    console.error("Error searching YouTube:", error);
    res
      .status(500)
      .json({success: false, message: "Server error while searching videos"});
  }
};

// Now this export will work
module.exports = {
  searchYouTube,
};
