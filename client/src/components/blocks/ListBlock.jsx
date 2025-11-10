import React from "react";
import ReactMarkdown from "react-markdown";
import "./ListBlock.css"; // For styling

const ListBlock = ({content, listType}) => {
  // Content is now an array of strings
  const items = content.map((item, index) => (
    <li key={index}>
      <ReactMarkdown>{item}</ReactMarkdown>
    </li>
  ));

  if (listType === "numbered") {
    return <ol className="list-block">{items}</ol>;
  }
  return <ul className="list-block">{items}</ul>;
};

export default ListBlock;
