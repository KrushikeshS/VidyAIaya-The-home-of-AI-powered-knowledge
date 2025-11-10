import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react"; // 🔧 CHANGED
import "./CourseOverviewPage.css";

const CourseOverviewPage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {courseId} = useParams();
  const {getAccessTokenSilently} = useAuth0(); // 🔧 CHANGED

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        // 🔧 CHANGED: always fetch an access token and normalize it to a string
        const tr = await getAccessTokenSilently({
          authorizationParams: {audience: import.meta.env.VITE_AUTH0_AUDIENCE},
          detailedResponse: true,
        });
        const accessToken = typeof tr === "string" ? tr : tr?.access_token;

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/courses/${courseId}`,
          {
            headers: {Authorization: `Bearer ${accessToken}`}, // 🔧 CHANGED
          }
        );

        if (response.data.success) {
          setCourse(response.data.data);
        } else {
          setError(response?.data?.message || "Failed to fetch course.");
        }

        setLoading(false);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch course."); // 🔧 CHANGED
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, getAccessTokenSilently]); // 🔧 CHANGED

  if (loading) return <div>Loading course...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!course) return <div>No course found.</div>;

  return (
    <div className="course-overview">
      <Link to="/my-courses" className="breadcrumb-link">
        &larr; Back to Courses
      </Link>

      <h1>{course.title}</h1>
      <p className="course-description">{course.description}</p>

      <div className="modules-list">
        {(course.modules || []).map(
          (
            module // 🔧 CHANGED: guard
          ) => (
            <div key={module._id} className="module-card">
              <h2>{module.title}</h2>
              <ul className="lessons-list">
                {(module.lessons || []).map(
                  (
                    lesson // 🔧 CHANGED: guard
                  ) => (
                    <li key={lesson._id}>
                      <Link
                        to={`/lesson/${lesson._id}`}
                        state={{course: course}}
                      >
                        {lesson.title}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CourseOverviewPage;
