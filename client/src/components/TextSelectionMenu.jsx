import React, {useState, useEffect, useRef} from "react";
import {BookOpen, HelpCircle, Zap, X, CheckCircle, XCircle} from "lucide-react";
import ReactMarkdown from "react-markdown";
import "./TextSelectionMenu.css";

const TextSelectionMenu = ({children}) => {
  const [position, setPosition] = useState(null); // {x, y}
  const [selection, setSelection] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [resultType, setResultType] = useState(null); // 'text' or 'quiz'
  const [resultContent, setResultContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleMouseUp = () => {
      const activeSelection = window.getSelection();
      const text = activeSelection.toString().trim();

      if (!text) {
        if (!showResult) setPosition(null);
        return;
      }

      if (showResult) return;

      const range = activeSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Calculate available space above
      const spaceAbove = rect.top;
      const menuHeight = 50; // Approximate height of the options menu
      
      let y;
      let placement = "top";

      if (spaceAbove > menuHeight + 20) {
        // Enough space above
        y = rect.top - 10 + window.scrollY;
      } else {
        // Not enough space, render below
        y = rect.bottom + 10 + window.scrollY;
        placement = "bottom";
      }

      setPosition({
        x: rect.left + rect.width / 2,
        y: y,
        placement: placement
      });
      setSelection(text);
    };

    const handleMouseDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setPosition(null);
        setShowResult(false);
        setSelection("");
        setResultContent(null);
        window.getSelection().removeAllRanges();
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [showResult]);

  const handleAction = async (action) => {
    setLoading(true);
    setShowResult(true);
    setResultType(action === "quiz" ? "quiz" : "text");
    
    // Truncate selection for display if too long
    const displaySelection = selection.length > 50 ? selection.substring(0, 50) + "..." : selection;

    setTimeout(() => {
      if (action === "explain") {
        setResultContent(`💡 **Explanation:** \n\n"${displaySelection}" refers to a key concept. In this context, it acts as a foundational element for understanding the larger system.`);
      } else if (action === "simplify") {
        setResultContent(`👶 **Simply put:** \n\nImagine "${displaySelection}" is like a Lego brick. You need it to build the castle!`);
      } else if (action === "quiz") {
        // Mock Quiz Data
        setResultContent({
          question: `What is the main purpose of "${displaySelection}"?`,
          options: [
            "To confuse the reader",
            "To solve the core problem",
            "To add decorative flair"
          ],
          correctIndex: 1
        });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      {children}
      
      {position && (
        <div 
          ref={menuRef}
          className={`magic-menu-container ${position.placement}`}
          style={{
            top: position.y,
            left: position.x,
          }}
        >
          {!showResult ? (
            <div className="magic-menu-options">
              <button onClick={() => handleAction("explain")} className="magic-btn">
                <BookOpen size={16} /> Explain
              </button>
              <div className="magic-divider" />
              <button onClick={() => handleAction("simplify")} className="magic-btn">
                <HelpCircle size={16} /> Simplify
              </button>
              <div className="magic-divider" />
              <button onClick={() => handleAction("quiz")} className="magic-btn">
                <Zap size={16} /> Quiz Me
              </button>
            </div>
          ) : (
            <div className="magic-result-card">
              <div className="magic-result-header">
                <span className="magic-ai-badge">Vidy AI</span>
                <button className="magic-close-btn" onClick={() => setPosition(null)}>
                  <X size={14} />
                </button>
              </div>
              <div className="magic-result-body">
                {loading ? (
                  <div className="magic-loader">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                ) : (
                  <>
                    {resultType === "text" ? (
                      <ReactMarkdown>{resultContent}</ReactMarkdown>
                    ) : (
                      <MiniQuiz data={resultContent} />
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          
          <div className="magic-arrow" />
        </div>
      )}
    </>
  );
};

// Internal Mini Quiz Component
const MiniQuiz = ({data}) => {
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSelect = (index) => {
    if (selected !== null) return; // Prevent changing answer
    setSelected(index);
    setIsCorrect(index === data.correctIndex);
  };

  return (
    <div className="mini-quiz">
      <p className="mini-quiz-question">{data.question}</p>
      <div className="mini-quiz-options">
        {data.options.map((opt, i) => {
          let className = "mini-quiz-option";
          if (selected === i) {
            className += isCorrect ? " correct" : " incorrect";
          } else if (selected !== null && i === data.correctIndex) {
            className += " correct"; // Show correct answer if wrong
          }

          return (
            <button 
              key={i} 
              className={className}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
            >
              {opt}
              {selected === i && (
                isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TextSelectionMenu;
