import React from "react";
import ReactMarkdown from "react-markdown"; // <-- 1. Import
import "./CalloutBlock.css";

const CalloutBlock = ({content, calloutType}) => {
  const emojiMap = {
    info: "ℹ️",
    warning: "⚠️",
    tip: "💡",
    success: "✅",
  };

  return (
    <div className={`callout-block ${calloutType}`}>
      <span className="callout-emoji">{emojiMap[calloutType] || "ℹ️"}</span>

      {/* 2. Use ReactMarkdown here */}
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default CalloutBlock;
