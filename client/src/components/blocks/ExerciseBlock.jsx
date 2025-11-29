import React from "react";
import ReactMarkdown from "react-markdown";
import {Dumbbell} from "lucide-react";
import "./ExerciseBlock.css";

const ExerciseBlock = ({content, hint}) => {
  return (
    <div className="exercise-block">
      <h4>
        <Dumbbell size={24} color="var(--primary)" />
        Exercise: Hands-on Challenge
      </h4>

      <ReactMarkdown>{content}</ReactMarkdown>

      {hint && (
        <div className="exercise-hint-wrapper">
          <ReactMarkdown>{`**Hint:** ${hint}`}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default ExerciseBlock;
