import React, {useState, useEffect} from "react";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import "./VideoBlock.css"; // We'll create this

const VideoBlock = ({content}) => {
  // 'content' is the search query from the AI (e.g., "React Hooks explained")
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {getAccessTokenSilently} = useAuth0();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError("");

        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });

        // Call our new backend endpoint
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/video/search`,
          {
            params: {query: content}, // Pass the search query
            headers: {Authorization: `Bearer ${token}`},
          }
        );

        if (response.data.success) {
          setVideoId(response.data.videoId);
        }
      } catch (err) {
        console.error("Failed to fetch video", err);
        setError("Could not load video.");
      }
      setLoading(false);
    };

    fetchVideo();
  }, [content, getAccessTokenSilently]); // Re-run if the search query changes

  if (loading) {
    return <div className="video-placeholder">Loading video...</div>;
  }

  if (error) {
    return <div className="video-placeholder error">{error}</div>;
  }

  return (
    <div className="video-container">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoBlock;
