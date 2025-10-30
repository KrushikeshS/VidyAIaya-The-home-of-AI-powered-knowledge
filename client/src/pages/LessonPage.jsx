import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import LessonRenderer from "../components/LessonRenderer";

const LessonPage = () => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {lessonId} = useParams();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        // This is the API call to the endpoint we built in Step 3.1
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
  }, [lessonId]);

  if (loading) return <div>Loading lesson...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!lesson) return <div>No lesson found.</div>;

  return (
    <div className="lesson-page">
      <h1>{lesson.title}</h1>
      <LessonRenderer contentBlocks={lesson.content} />
    </div>
  );
};

export default LessonPage;
