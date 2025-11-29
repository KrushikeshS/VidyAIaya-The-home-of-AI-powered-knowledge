import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import {ArrowLeft, BookOpen, Star, Target, FileText} from "lucide-react";
import CourseMap from "../components/CourseMap"; 
import CheatSheetModal from "../components/CheatSheetModal"; // Import Modal
import "./CourseOverviewPage.css";

const CourseOverviewPage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCheatSheet, setShowCheatSheet] = useState(false); // State for modal
  const {courseId} = useParams();
  const {getAccessTokenSilently, isAuthenticated} = useAuth0();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();

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
        <ArrowLeft size={16} style={{ marginRight: "8px" }} />
        Back to My Courses
      </Link>

      <div className="course-header-section">
        <h1>{course.title}</h1>
        <p className="course-description">{course.description}</p>
        
        <div className="header-meta-row">
          {course.targetAudience && (
            <span className="target-audience">
              <Target size={16} style={{ marginRight: "8px", verticalAlign: "text-bottom" }} />
              For {course.targetAudience}
            </span>
          )}
          
          {/* Cheat Sheet Button */}
          <button 
            className="cheat-sheet-btn"
            onClick={() => setShowCheatSheet(true)}
          >
            <FileText size={16} /> Download Cheat Sheet
          </button>
        </div>
      </div>

      <h2 className="modules-section-title">Your Journey</h2>
      <CourseMap course={course} />

      <div className="course-details-grid" style={{marginTop: "60px"}}>
        <div className="course-detail-card">
          <h3>
            <Star size={20} />
            What You'll Learn
          </h3>
          <ul>
            {course.learningOutcomes?.map((outcome, i) => (
              <li key={i}>{outcome}</li>
            ))}
          </ul>
        </div>
        <div className="course-detail-card">
          <h3>
            <BookOpen size={20} />
            Prerequisites
          </h3>
          <ul>
            {course.prerequisites?.map((prereq, i) => (
              <li key={i}>{prereq}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Render Modal */}
      {showCheatSheet && (
        <CheatSheetModal 
          course={course} 
          onClose={() => setShowCheatSheet(false)} 
        />
      )}
    </div>
  );
};

export default CourseOverviewPage;
