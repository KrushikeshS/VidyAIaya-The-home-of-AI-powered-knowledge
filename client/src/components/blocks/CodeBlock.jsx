import React from "react";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {atomDark} from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({content, language}) => {
  return (
    <div style={{ margin: "32px 0" }}>
      <SyntaxHighlighter
        language={language || "javascript"}
        style={atomDark}
        wrapLines={true}
        customStyle={{
          borderRadius: "16px",
          padding: "24px",
          margin: 0,
          border: "2px solid #2d3748",
        }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
