import React, {useState, useEffect, useCallback} from "react"; // <-- 1. Import useCallback
import {useParams, useLocation, Link, useNavigate} from "react-router-dom";
import axios from "axios";
import LessonRenderer from "../components/LessonRenderer";
import "./LessonPage.css"; // This already exists

const LessonPage = () => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // We'll use this to show the error

  const {lessonId} = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {course} = location.state || {};

  // 2. Create a reusable fetch function
  const fetchLesson = useCallback(async () => {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors
      setLesson(null); // <-- THIS IS THE FIX: Clear the old lesson

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons/${lessonId}`
      );

      if (response.data.success) {
        setLesson(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch lesson:", err);
      // This is the AI 503 error. Set a user-friendly message.
      setError("The AI model is busy. Please try again in a moment.");
    }
    setLoading(false);
  }, [lessonId]); // It depends on lessonId

  // 3. Find navigation logic (this is the same as before)
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

  // 4. Call fetchLesson on load
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchLesson();
  }, [lessonId, fetchLesson]); // Run when lessonId changes or fetchLesson is created

  const navigateToLesson = (id) => {
    if (id) {
      navigate(`/lesson/${id}`, {state: {course: course}});
    }
  };

  // 5. This is the new, robust rendering logic
  return (
    <div className="lesson-page">
      {/* --- HEADER AND BREADCRUMBS --- */}
      {course && (
        <Link to={`/course/${course._id}`} className="breadcrumb-link">
          &larr; Back to Course: {course.title}
        </Link>
      )}

      {/* Show title if we have it, even if loading/error */}
      <h1>{lesson ? lesson.title : "Loading lesson..."}</h1>

      {/* --- RENDER STATES --- */}
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

      {lesson && !loading && <LessonRenderer contentBlocks={lesson.content} />}

      {/* --- NAVIGATION --- */}
      <div className="lesson-navigation">
        <button
          onClick={() => navigateToLesson(prevLessonId)}
          disabled={!prevLessonId}
          className="nav-button prev"
        >
          &larr; Previous Lesson
        </button>
        <button
          onClick={() => navigateToLesson(nextLessonId)}
          disabled={!nextLessonId}
          className="nav-button next"
        >
          Next Lesson &rarr;
        </button>
      </div>
    </div>
  );
};

export default LessonPage;
