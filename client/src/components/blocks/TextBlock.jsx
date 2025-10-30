import React from "react";

const TextBlock = ({content}) => {
  return (
    <p
      style={{
        lineHeight: "1.7",
        fontSize: "1.125rem", // Larger font
        color: "#2d3748", // Darker text
        margin: "1.5em 0", // Better spacing
      }}
    >
      {content}
    </p>
  );
};

export default TextBlock;
