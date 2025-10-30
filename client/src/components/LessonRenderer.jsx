import React from "react";
import TextBlock from "./blocks/TextBlock";
import CodeBlock from "./blocks/CodeBlock";
import VideoBlock from "./blocks/VideoBlock";
import QuizBlock from "./blocks/QuizBlock";

const LessonRenderer = ({contentBlocks}) => {
  return (
    <div className="lesson-content">
      {contentBlocks.map((block) => {
        switch (block.type) {
          case "text":
            return <TextBlock key={block._id} content={block.content} />;
          case "code":
            return (
              <CodeBlock
                key={block._id}
                content={block.content}
                language={block.language}
              />
            );
          case "video":
            return <VideoBlock key={block._id} content={block.content} />;
          case "quiz":
            return (
              <QuizBlock
                key={block._id}
                content={block.content}
                options={block.options}
                correctAnswer={block.correctAnswer}
              />
            );
          default:
            return (
              <p key={block._id}>Unsupported content type: {block.type}</p>
            );
        }
      })}
    </div>
  );
};

export default LessonRenderer;
