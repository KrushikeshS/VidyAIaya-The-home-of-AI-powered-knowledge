import React, {useState, useEffect, useCallback} from "react";
import {useParams, useLocation, Link, useNavigate} from "react-router-dom";
import axios from "axios";
import LessonRenderer from "../components/LessonRenderer";
import TextSelectionMenu from "../components/TextSelectionMenu"; // Import the new component
import {useGamification} from "../context/GamificationContext";
import {useProgress} from "../context/ProgressContext";
import "./LessonPage.css";

const LessonPage = () => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {addXp, triggerConfetti} = useGamification();
  const {markLessonCompleted} = useProgress();

  const {lessonId} = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {course} = location.state || {};

  const fetchLesson = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setLesson(null);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons/${lessonId}`
      );

      if (response.data.success) {
        setLesson(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch lesson:", err);
      setError("The AI model is busy. Please try again in a moment.");
    }
    setLoading(false);
  }, [lessonId]);

  const allLessonIds = course
    ? course.modules.flatMap((m) => m.lessons.map((l) => l._id))
    : [];
  const currentLessonIndex = allLessonIds.indexOf(lessonId);
  const prevLessonId =
    currentLessonIndex > 0 ? allLessonIds[currentLessonIndex - 1] : null;
  const nextLessonId =
    currentLessonIndex < allLessonIds.length - 1
      ? allLessonIds[currentLessonIndex + 1]
      : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchLesson();
  }, [lessonId, fetchLesson]);

  const navigateToLesson = (id) => {
    if (id) {
      navigate(`/lesson/${id}`, {state: {course: course}});
    }
  };

  const handleFinishLesson = () => {
    // 1. Award XP
    addXp(50); 
    triggerConfetti();

    // 2. Mark as completed in global state
    if (course) {
      markLessonCompleted(course._id, lessonId);
    }

    // 3. Navigate back to the MAP with auto-advance instruction
    if (nextLessonId) {
      navigate(`/course/${course._id}`, {
        state: {
          autoStartNext: nextLessonId
        }
      });
    } else {
      // Course finished!
      navigate(`/course/${course._id}`);
    }
  };

  return (
    <div className="lesson-page">
      {course && (
        <Link to={`/course/${course._id}`} className="breadcrumb-link">
          &larr; Back to Course: {course.title}
        </Link>
      )}

      <h1>{lesson ? lesson.title : "Loading lesson..."}</h1>

      {loading && (
        <div className="lesson-loading-spinner">Loading Content...</div>
      )}

      {error && !loading && (
        <div className="lesson-error-box">
          <p>{error}</p>
          <button onClick={fetchLesson} className="nav-button retry-button">
            Retry
          </button>
        </div>
      )}

      {lesson && !loading && (
        <TextSelectionMenu>
          <LessonRenderer contentBlocks={lesson.content} />
        </TextSelectionMenu>
      )}

      <div className="lesson-navigation">
        <button
          onClick={() => navigateToLesson(prevLessonId)}
          disabled={!prevLessonId}
          className="nav-button prev"
        >
          &larr; Previous
        </button>
        
        <button
          onClick={handleFinishLesson}
          className="nav-button next"
        >
          {nextLessonId ? "Complete & Continue" : "Finish Course 🏆"}
        </button>
      </div>
    </div>
  );
};

export default LessonPage;
