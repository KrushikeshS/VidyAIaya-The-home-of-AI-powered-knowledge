import React from "react";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {atomDark} from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({content, language}) => {
  return (
    <SyntaxHighlighter
      language={language || "javascript"}
      style={atomDark}
      wrapLines={true}
      customStyle={{
        borderRadius: "8px",
        padding: "15px",
        margin: "15px 0",
      }}
    >
      {content}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
