import React, {useState, useEffect} from "react";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import {Link} from "react-router-dom";
import {BookOpen, Layers, Plus} from "lucide-react";
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
      <h1>
        <BookOpen size={32} color="var(--primary)" />
        My Courses
      </h1>
      {courses.length === 0 ? (
        <div className="empty-state">
          <p>
            You haven't created any courses yet.
          </p>
          <Link to="/" className="btn btn-primary">
            <Plus size={20} style={{ marginRight: "8px" }} />
            Create Your First Course
          </Link>
        </div>
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
                <div style={{ marginTop: "auto" }}>
                  <span className="course-modules">
                    <Layers size={16} style={{ marginRight: "6px" }} />
                    {course.modules.length} Modules
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
