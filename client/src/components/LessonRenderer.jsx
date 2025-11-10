import React from "react";

// Import all our blocks
import TextBlock from "./blocks/TextBlock";
import CodeBlock from "./blocks/CodeBlock";
import VideoBlock from "./blocks/VideoBlock";
import QuizBlock from "./blocks/QuizBlock";
import HeadingBlock from "./blocks/HeadingBlock"; // <-- New
import ListBlock from "./blocks/ListBlock"; // <-- New
import CalloutBlock from "./blocks/CalloutBlock"; // <-- New
import ExerciseBlock from "./blocks/ExerciseBlock"; // <-- New

const LessonRenderer = ({contentBlocks}) => {
  return (
    <div className="lesson-content">
      {contentBlocks.map((block) => {
        // Use block._id as the key
        switch (block.type) {
          case "text":
            return <TextBlock key={block._id} content={block.content} />;
          case "heading": // <-- New
            return <HeadingBlock key={block._id} content={block.content} />;
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
                explanation={block.explanation} // Pass new prop
              />
            );
          case "list": // <-- New
            return (
              <ListBlock
                key={block._id}
                content={block.content} // This is an array
                listType={block.listType}
              />
            );
          case "callout": // <-- New
            return (
              <CalloutBlock
                key={block._id}
                content={block.content}
                calloutType={block.calloutType}
              />
            );
          case "exercise": // <-- New
            return (
              <ExerciseBlock
                key={block._id}
                content={block.content}
                hint={block.hint}
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
