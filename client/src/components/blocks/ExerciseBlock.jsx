import React from "react";
import ReactMarkdown from "react-markdown";
import "./ExerciseBlock.css";

const ExerciseBlock = ({content, hint}) => {
  return (
    <div className="exercise-block">
      <h4>🏋️ Exercise: Hands-on Challenge</h4>

      {/* This is the main content. We removed className.
        We will style its <p> tags via .exercise-block p { ... }
      */}
      <ReactMarkdown>{content}</ReactMarkdown>

      {hint && (
        // We add a wrapper div to style the hint
        <div className="exercise-hint-wrapper">
          <ReactMarkdown>{`**Hint:** ${hint}`}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default ExerciseBlock;
