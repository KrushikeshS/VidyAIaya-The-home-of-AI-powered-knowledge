import React, {useState, useEffect} from "react";
import {useParams, useLocation, Link, useNavigate} from "react-router-dom"; // <-- Import new hooks
import axios from "axios";
import LessonRenderer from "../components/LessonRenderer";
import "./LessonPage.css"; // <-- Import new CSS

const LessonPage = () => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {lessonId} = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {course} = location.state || {}; // <-- Get the course from state

  // Create a flat list of all lesson IDs
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
    // Scroll to top when lesson changes
    window.scrollTo(0, 0);

    const fetchLesson = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5001/api/lessons/${lessonId}`
        );
        if (response.data.success) {
          setLesson(response.data.data);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch lesson.");
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]); // Re-run this effect when lessonId changes

  // Helper function for navigation
  const navigateToLesson = (id) => {
    if (id) {
      // We must pass the state again
      navigate(`/lesson/${id}`, {state: {course: course}});
    }
  };

  if (loading) return <div>Loading lesson...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!lesson) return <div>No lesson found.</div>;

  return (
    <div className="lesson-page">
      {course && (
        <Link to={`/course/${course._id}`} className="breadcrumb-link">
          &larr; Back to Course: {course.title}
        </Link>
      )}
      <h1>{lesson.title}</h1>

      <LessonRenderer contentBlocks={lesson.content} />

      {/* THE NEW NAVIGATION */}
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
