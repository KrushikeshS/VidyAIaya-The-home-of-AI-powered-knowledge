import React from "react";
import "./QuizBlock.css"; // We'll create this file

const QuizBlock = ({content, options, correctAnswer}) => {
  return (
    <div className="quiz-block">
      <h4>Quiz: {content}</h4>
      <ul className="quiz-options">
        {options.map((option, index) => (
          <li key={index} className={option === correctAnswer ? "correct" : ""}>
            {option}
          </li>
        ))}
      </ul>
      <p className="quiz-answer">Correct Answer: {correctAnswer}</p>
    </div>
  );
};

export default QuizBlock;
