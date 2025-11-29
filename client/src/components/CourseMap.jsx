import React, {useEffect, useRef} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {Check, Lock, Star, Play, Bot} from "lucide-react";
import {useProgress} from "../context/ProgressContext";
import "./CourseMap.css";

const CourseMap = ({course}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const {isLessonCompleted} = useProgress();

  // Check for auto-advance request from LessonPage
  const {autoStartNext} = location.state || {};

  // 1. Flatten the course structure into a single list of nodes
  const nodes = [];
  let globalIndex = 0;

  course.modules.forEach((module, mIndex) => {
    nodes.push({
      type: "header",
      title: module.title,
      id: `module-${mIndex}`,
      index: globalIndex,
    });

    module.lessons.forEach((lesson, lIndex) => {
      nodes.push({
        type: "lesson",
        data: lesson,
        id: lesson._id,
        index: globalIndex,
      });
      globalIndex++;
    });
  });

  // 2. Determine status
  const lessonNodes = nodes.filter(n => n.type === "lesson");
  let firstIncompleteIndex = -1;

  for (let i = 0; i < lessonNodes.length; i++) {
    if (!isLessonCompleted(course._id, lessonNodes[i].id)) {
      firstIncompleteIndex = i;
      break;
    }
  }

  const currentIndex = firstIncompleteIndex === -1 ? lessonNodes.length - 1 : firstIncompleteIndex;

  // 3. Calculate Positions
  const NODE_HEIGHT = 100;
  const AMPLITUDE = 70;
  const HEADER_OFFSET = 60;

  let currentY = 40;

  const positionedNodes = nodes.map((node, i) => {
    let x = 0;
    
    if (node.type === "header") {
      x = 0;
      currentY += HEADER_OFFSET;
    } else {
      const pattern = node.index % 4;
      if (pattern === 1) x = AMPLITUDE;
      else if (pattern === 3) x = -AMPLITUDE;
      else x = 0;

      currentY += NODE_HEIGHT;
    }

    return {
      ...node,
      x,
      y: currentY,
    };
  });

  const totalHeight = currentY + 100;

  // 4. Generate SVG Paths (Background & Progress)
  const positionedLessonNodes = positionedNodes.filter(n => n.type === "lesson");
  
  const generatePath = (endIndex) => {
    if (positionedLessonNodes.length === 0) return "";
    let d = `M ${positionedLessonNodes[0].x + 300} ${positionedLessonNodes[0].y + 32}`;
    
    // Ensure we don't go out of bounds
    const limit = Math.min(endIndex, positionedLessonNodes.length - 1);

    for (let i = 0; i < limit; i++) {
      const current = positionedLessonNodes[i];
      const next = positionedLessonNodes[i+1];
      
      const startX = current.x + 300;
      const startY = current.y + 32;
      const endX = next.x + 300;
      const endY = next.y + 32;

      const cp1x = startX;
      const cp1y = startY + (endY - startY) / 2;
      const cp2x = endX;
      const cp2y = endY - (endY - startY) / 2;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
    }
    return d;
  };

  const fullPathD = generatePath(positionedLessonNodes.length - 1);
  // The green path should go up to the current index
  const progressPathD = generatePath(currentIndex);

  // 5. Handle Click
  const handleNodeClick = (lessonId, status) => {
    if (status === "locked") return;
    navigate(`/lesson/${lessonId}`, {state: {course}});
  };

  // 6. Auto-Advance Logic
  useEffect(() => {
    if (autoStartNext) {
      // Wait for animation (e.g., 2 seconds) then go
      const timer = setTimeout(() => {
        // Verify the next lesson is actually unlocked (it should be)
        // and that it matches the one we want to go to
        navigate(`/lesson/${autoStartNext}`, {state: {course}, replace: true});
      }, 2000); // 2 seconds delay for the user to see the map update

      return () => clearTimeout(timer);
    }
  }, [autoStartNext, navigate, course]);

  // Scroll to current node on load
  useEffect(() => {
    const currentNode = document.querySelector(".node-button.current");
    if (currentNode) {
      currentNode.scrollIntoView({behavior: "smooth", block: "center"});
    }
  }, []);

  return (
    <div className="course-map-container" ref={containerRef} style={{height: totalHeight}}>
      <svg className="map-svg-layer" width="100%" height={totalHeight} viewBox={`0 0 600 ${totalHeight}`} preserveAspectRatio="xMidYMin slice">
        {/* Gray Background Path */}
        <path d={fullPathD} className="path-line-bg" />
        
        {/* Green Progress Path */}
        <path 
          d={progressPathD} 
          className="path-line-progress" 
          style={{
            strokeDasharray: "none", 
            strokeDashoffset: 0,
            animation: "drawPath 1s ease forwards"
          }} 
        />
      </svg>

      {positionedNodes.map((node, i) => {
        if (node.type === "header") {
          return (
            <div 
              key={node.id} 
              className="unit-header"
              style={{top: node.y}}
            >
              {node.title}
            </div>
          );
        }

        const lessonIndex = positionedLessonNodes.findIndex(n => n.id === node.id);
        
        let status = "locked";
        if (isLessonCompleted(course._id, node.id)) {
          status = "completed";
        } else if (lessonIndex === currentIndex) {
          status = "current";
        } else if (lessonIndex < currentIndex) {
           status = "completed";
        }

        return (
          <div 
            key={node.id} 
            className="lesson-node"
            style={{
              top: node.y,
              left: `calc(50% + ${node.x}px)`
            }}
          >
            {status === "current" && (
              <div className="mascot-avatar">
                <img 
                  src="/vidy-mascot.png" 
                  alt="Vidy Mascot" 
                  style={{
                    width: "100%", 
                    height: "100%", 
                    objectFit: "contain",
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                  }} 
                />
              </div>
            )}

            <button 
              className={`node-button ${status}`}
              onClick={() => handleNodeClick(node.id, status)}
            >
              {status === "completed" ? (
                <Check size={32} />
              ) : status === "current" ? (
                <Play size={32} fill="currentColor" />
              ) : (
                <Lock size={24} />
              )}
            </button>

            <div className="node-tooltip">
              {node.data.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CourseMap;
