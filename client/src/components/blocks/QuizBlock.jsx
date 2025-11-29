import React, {useState} from "react";
import {CheckCircle, XCircle} from "lucide-react";
import {useGamification} from "../../context/GamificationContext";
import "./QuizBlock.css";

const QuizBlock = ({content, options, correctAnswer, explanation}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {addXp, triggerConfetti} = useGamification();

  const handleSubmit = () => {
    if (selectedOption) {
      setIsSubmitted(true);
      
      const cleanSelected = selectedOption.trim();
      const cleanCorrect = correctAnswer.trim();

      // Check if the correct answer is just a letter like "A" or "A."
      // And if the selected option STARTS with that letter.
      const correctIsLetter = /^[A-D]\.?$/i.test(cleanCorrect);
      
      let isMatch = false;
      if (correctIsLetter) {
        // If correct answer is "A", check if selected option starts with "A." or is just "A"
        const letter = cleanCorrect.charAt(0).toUpperCase();
        isMatch = cleanSelected.toUpperCase().startsWith(letter);
      } else {
        // Otherwise, do a full text comparison
        isMatch = cleanSelected.toLowerCase() === cleanCorrect.toLowerCase();
      }
      
      if (isMatch) {
        addXp(10); 
        triggerConfetti();
      }
    }
  };

  // We need to replicate the match logic for the render phase
  const checkMatch = (option, correct) => {
    if (!option || !correct) return false;
    const cleanOption = option.trim();
    const cleanCorrect = correct.trim();
    const correctIsLetter = /^[A-D]\.?$/i.test(cleanCorrect);
    if (correctIsLetter) {
      return cleanOption.toUpperCase().startsWith(cleanCorrect.charAt(0).toUpperCase());
    }
    return cleanOption.toLowerCase() === cleanCorrect.toLowerCase();
  };

  const isCorrect = checkMatch(selectedOption, correctAnswer);

  return (
    <div className="quiz-block">
      <h4>{content}</h4>
      <div className="quiz-options">
        {options.map((option, index) => {
          let optionClass = "quiz-option";
          if (selectedOption === option) optionClass += " selected";
          if (isSubmitted) {
            // Use the same robust matching logic
            if (checkMatch(option, correctAnswer)) optionClass += " correct";
            else if (option === selectedOption) optionClass += " incorrect";
          }

          return (
            <button
              key={index}
              className={optionClass}
              onClick={() => !isSubmitted && setSelectedOption(option)}
              disabled={isSubmitted}
            >
              {option}
            </button>
          );
        })}
      </div>

      {!isSubmitted ? (
        <button 
          className="btn btn-primary quiz-check-btn" 
          onClick={handleSubmit}
          disabled={!selectedOption}
        >
          Check Answer
        </button>
      ) : (
        <div className={`quiz-feedback ${isCorrect ? "success" : "error"}`}>
          {isCorrect ? (
            <>
              <CheckCircle size={24} />
              <div>
                <div>Correct! (+10 XP)</div>
                <div style={{fontWeight: 400, fontSize: "0.9rem", marginTop: "4px"}}>{explanation}</div>
              </div>
            </>
          ) : (
            <>
              <XCircle size={24} />
              <div>
                <div>Incorrect. The correct answer is: {correctAnswer}</div>
                <div style={{fontWeight: 400, fontSize: "0.9rem", marginTop: "4px"}}>{explanation}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizBlock;
