import React from "react";
import ReactMarkdown from "react-markdown";
import "./TextBlock.css"; // We'll add this for styling

const TextBlock = ({content}) => {
  return (
    <div className="text-block-container">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default TextBlock;
