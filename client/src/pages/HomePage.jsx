import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {Sparkles, Zap, Search, AlertCircle} from "lucide-react";
import "./HomePage.css";

const HomePage = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {getAccessTokenSilently, loginWithRedirect, isAuthenticated} = useAuth0();

  const handleGenerateCourse = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/courses/generate`,
        {topic},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        navigate(`/course/${response.data.data._id}`);
      }
    } catch (err) {
      console.error("Error generating course:", err);
      setError(
        err.response?.data?.error || "Failed to generate course. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage">
      <div className="hero-icon">
        <Sparkles size={64} color="var(--accent)" fill="var(--accent)" />
      </div>
      
      <h1>What do you want to learn?</h1>
      <p>Type a topic, and we'll build a fun, interactive course for you in seconds.</p>

      <form onSubmit={handleGenerateCourse} className="prompt-form">
        <div className="input-wrapper">
          <Search size={24} color="var(--text-light)" style={{marginLeft: "12px"}} />
          <input
            type="text"
            className="prompt-input"
            placeholder="e.g. Quantum Physics, Spanish, React.js..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            className="prompt-button" 
            disabled={loading || !topic.trim()}
          >
            {loading ? (
              "Building..."
            ) : (
              <>
                <Zap size={20} fill="currentColor" />
                Generate
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          <AlertCircle size={24} />
          {error}
        </div>
      )}
    </div>
  );
};

export default HomePage;
