import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import "./CourseOverviewPage.css";

const CourseOverviewPage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {courseId} = useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5001/api/courses/${courseId}`
        );
        if (response.data.success) {
          setCourse(response.data.data);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch course.");
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <div>Loading course...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!course) return <div>No course found.</div>;

  return (
    <div className="course-overview">
      {/* ✅ Add breadcrumb navigation */}
      <Link to="/my-courses" className="breadcrumb-link">
        &larr; Back to Courses
      </Link>

      <h1>{course.title}</h1>
      <p className="course-description">{course.description}</p>

      <div className="modules-list">
        {course.modules.map((module) => (
          <div key={module._id} className="module-card">
            <h2>{module.title}</h2>
            <ul className="lessons-list">
              {module.lessons.map((lesson) => (
                <li key={lesson._id}>
                  {/* Pass the course object via Link state */}
                  <Link to={`/lesson/${lesson._id}`} state={{course: course}}>
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseOverviewPage;
