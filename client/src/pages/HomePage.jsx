import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import "./HomePage.css";

const HomePage = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {getAccessTokenSilently, loginWithRedirect, isAuthenticated} =
    useAuth0();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      await loginWithRedirect({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email offline_access",
        },
      });
      return;
    }

    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ always request a detailed response
      let tokenResp;
      try {
        tokenResp = await getAccessTokenSilently({
          authorizationParams: {audience: import.meta.env.VITE_AUTH0_AUDIENCE},
          detailedResponse: true,
        });
      } catch (err) {
        // fallback if silent fails
        tokenResp = await window.__AUTH0__?.getAccessTokenWithPopup?.({
          authorizationParams: {audience: import.meta.env.VITE_AUTH0_AUDIENCE},
          detailedResponse: true,
        });
      }

      // ✅ normalize token to string
      const accessToken =
        typeof tokenResp === "string" ? tokenResp : tokenResp?.access_token;

      // ✅ validate token format (must contain 2 dots)
      if (!accessToken || (accessToken.match(/\./g) || []).length !== 2) {
        console.error("Invalid or empty token:", accessToken?.slice?.(0, 20));
        setError("Login again to grant API access (invalid token).");
        setLoading(false);
        return;
      }

      // ✅ make API request
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/courses/generate`,
        {topic},
        {headers: {Authorization: `Bearer ${accessToken}`}}
      );

      setLoading(false);

      if (response.data && response.data.success) {
        navigate(`/course/${response.data.data._id}`);
      } else {
        setError(response?.data?.message || "Unexpected server response.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setLoading(false);
      setError("Failed to generate course. Please try again.");
    }
  };

  return (
    <div className="homepage">
      <h1>Create a New Course</h1>
      <p>
        Enter any topic you want to learn, and let AI build a course for you.
      </p>

      <form onSubmit={handleSubmit} className="prompt-form">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., 'Basics of React Hooks'"
          className="prompt-input"
        />
        <button type="submit" disabled={loading} className="prompt-button">
          {loading ? "Generating..." : "Generate Course"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default HomePage;
