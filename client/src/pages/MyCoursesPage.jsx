import React, {useState, useEffect} from "react";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import {Link} from "react-router-dom";
import "./MyCoursesPage.css";

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {getAccessTokenSilently} = useAuth0();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        });
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/courses/my-courses`,
          {
            headers: {Authorization: `Bearer ${token}`},
          }
        );

        if (response.data.success) {
          setCourses(response.data.data);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch your courses.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, [getAccessTokenSilently]);

  if (loading) return <div>Loading your courses...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="my-courses-page">
      <h1>My Courses</h1>
      {courses.length === 0 ? (
        <p>
          You haven't created any courses yet. <Link to="/">Get started!</Link>
        </p>
      ) : (
        <div className="course-list">
          {courses.map((course) => (
            <Link
              to={`/course/${course._id}`}
              key={course._id}
              className="course-card-link"
            >
              <div className="course-card">
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <span className="course-modules">
                  {course.modules.length} Modules
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
