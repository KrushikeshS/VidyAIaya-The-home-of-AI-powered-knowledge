import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import "./CourseOverviewPage.css"; // This CSS file will need updates

// This is the accordion component from your team's code
// (I've included it here for completeness)
const ModuleAccordion = ({module, course}) => {
  const [lessons, setLessons] = useState(module.lessons || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {getAccessTokenSilently} = useAuth0();

  const handleToggle = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    // Only fetch if lessons are just IDs (not populated)
    // Your team's code might already populate them. This logic handles both.
    if (lessons.length > 0 && typeof lessons[0] === "string") {
      setIsLoading(true);
      try {
        // This logic might need to be adapted to your team's new GET /api/modules/:id
        // For now, I'll assume the lessons are populated.
        // If not, we'd add the axios call here.
      } catch (err) {
        console.error("Failed to fetch lessons", err);
      }
      setIsLoading(false);
    }
  };

  // This part assumes your 'course' object has populated modules AND lessons
  // from the start, as your team's 'generateCourse' controller seems to do.
  return (
    <div className="module-card">
      <h2 onClick={handleToggle} style={{cursor: "pointer"}}>
        {module.title}
        <span>{isOpen ? "▲" : "▼"}</span>
      </h2>
      {isOpen && (
        <div className="lessons-list">
          {isLoading ? (
            <p>Loading lessons...</p>
          ) : (
            <ul>
              {module.lessons.map((lesson) => (
                <li key={lesson._id}>
                  <Link
                    to={`/lesson/${lesson._id}`}
                    state={{course: course}} // Pass the course context
                  >
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

const CourseOverviewPage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {courseId} = useParams();
  const {getAccessTokenSilently, isAuthenticated} = useAuth0();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/courses/${courseId}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          }
        );

        if (response.data.success) {
          setCourse(response.data.data);
        }
      } catch (err) {
        setError("Failed to fetch course.");
      }
      setLoading(false);
    };

    fetchCourse();
  }, [courseId, getAccessTokenSilently, isAuthenticated]);

  if (loading) return <div>Loading course...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!course) return <div>No course found.</div>;

  return (
    <div className="course-overview">
      <Link to="/my-courses" className="breadcrumb-link">
        &larr; Back to My Courses
      </Link>

      <h1>{course.title}</h1>
      <p className="course-description">{course.description}</p>
      <span className="target-audience">For {course.targetAudience}</span>

      {/* --- NEW SECTIONS --- */}
      <div className="course-details-grid">
        <div className="course-detail-card">
          <h3>What You'll Learn</h3>
          <ul>
            {course.learningOutcomes?.map((outcome, i) => (
              <li key={i}>{outcome}</li>
            ))}
          </ul>
        </div>
        <div className="course-detail-card">
          <h3>Prerequisites</h3>
          <ul>
            {course.prerequisites?.map((prereq, i) => (
              <li key={i}>{prereq}</li>
            ))}
          </ul>
        </div>
      </div>
      {/* --- END NEW SECTIONS --- */}

      <h2>Course Content</h2>
      <div className="modules-list">
        {course.modules.map((module) => (
          // This assumes your team's `generateCourse` populates lessons
          // If not, you may need the old `ModuleAccordion` logic
          <div key={module._id} className="module-card">
            <h2>{module.title}</h2>
            <p className="module-description">{module.description}</p>
            <ul className="lessons-list">
              {module.lessons.map((lesson) => (
                <li key={lesson._id}>
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
