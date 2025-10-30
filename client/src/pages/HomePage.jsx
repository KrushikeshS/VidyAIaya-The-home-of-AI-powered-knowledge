import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "./HomePage.css"; // We'll create this file

const HomePage = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic) {
      setError("Please enter a topic.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // This is the API call to your backend!
      const response = await axios.post(
        "http://localhost:5001/api/courses/generate",
        {
          topic: topic,
        }
      );

      setLoading(false);

      if (response.data && response.data.success) {
        // Success! Navigate to the new course page
        navigate(`/course/${response.data.data._id}`);
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to generate course. Please try again.");
      console.error(err);
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
