import React from "react";

const VideoBlock = ({content}) => {
  return (
    <div
      style={{
        margin: "24px 0",
        padding: "24px",
        background: "#f7fafc", // Light background
        border: "1px solid #e2e8f0", // Border
        borderRadius: "8px",
      }}
    >
      <strong
        style={{
          display: "block",
          marginBottom: "8px",
          fontSize: "1rem",
          color: "#2d3748",
        }}
      >
        Suggested Video:
      </strong>
      <p style={{margin: 0, fontStyle: "italic", color: "#718096"}}>
        A video on "{content}" will appear here in Phase 5.
      </p>
    </div>
  );
};

export default VideoBlock;
