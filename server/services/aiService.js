const {GoogleGenerativeAI} = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * A robust function to find and parse a JSON object from a string.
 * It looks for the first '{' and the last '}'
 */
function extractJson(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch && jsonMatch[0]) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Failed to parse extracted JSON:", e);
      console.error("Raw JSON text:", jsonMatch[0]);
      throw new Error("Failed to parse JSON from AI response.");
    }
  }
  console.error("No JSON object found in AI response:", text);
  throw new Error("No JSON object found in AI response.");
}

/**
 * Generates ONLY the course outline (title, description, module titles, lesson titles).
 */
async function generateCourseOutline(topic) {
  const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});
  const prompt = `
    You are an expert educator and instructional designer.
    Your task is to generate a comprehensive, high-quality course OUTLINE for the topic: "${topic}".
    The outline must be structured for a beginner, with a logical progression of concepts.
    You MUST generate the output in a single, valid JSON object. Do not include any text outside of the JSON.

    The JSON structure must be:
    {
      "title": "A Comprehensive Guide to ${topic}",
      "description": "A detailed, 1-2 sentence overview of what the student will learn in this course.",
      "modules": [
        {
          "title": "Module 1: Getting Started",
          "lessons": [
            { "title": "Lesson 1.1: Core Concepts" },
            { "title": "Lesson 1.2: Key Terminology" }
          ]
        },
        {
          "title": "Module 2: Deep Dive",
          "lessons": [
            { "title": "Lesson 2.1: Practical Applications" }
          ]
        }
      ]
    }

    Instructions:
    1.  Generate a course with 3-4 modules.
    2.  Generate 3-5 lesson titles per module.
    3.  The titles must be clear and descriptive.
    4.  ONLY include 'title' for lessons. DO NOT include a 'content' array.
    5.  Ensure the entire output is a single, valid JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Use the new robust extractor
    return extractJson(text);
  } catch (error) {
    console.error("Error in generateCourseOutline:", error);
    throw new Error("Failed to generate course outline from AI");
  }
}

/**
 * Generates ONLY the content for a single lesson.
 */
async function generateLessonContent(lessonTitle, courseTitle) {
  const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});
  const prompt = `
    You are an expert educator. Your task is to generate a comprehensive, in-depth, and engaging lesson.
    The course is: "${courseTitle}".
    The lesson is: "${lessonTitle}".

    Generate the lesson content as a single, valid JSON object.
    The JSON object must have a single "content" key, which is an array of content blocks.

    The structure must be:
    {
      "content": [
        { "type": "text", "content": "Start with a detailed introduction to the topic." },
        { "type": "text", "content": "Follow with a core concept, explained clearly and thoroughly." },
        { "type": "code", "content": "console.log('Provide a practical, well-commented code example');", "language": "javascript" },
        { "type": "video", "content": "A specific search query for a high-quality YouTube video, e.g., 'In-depth explanation of React useState hook'" },
        { "type": "quiz", "content": "A thoughtful multiple-choice question to test understanding.", "options": ["Option 1", "Option 2", "Option 3"], "correctAnswer": "Option 1" },
        { "type": "text", "content": "Conclude with a summary of the key takeaways from this lesson." }
      ]
    }

    Instructions:
    1.  Be thorough. Do not be brief. The lesson should be comprehensive.
    2.  Create an array of **6-8 content blocks** to make the lesson detailed.
    3.  Vary the block types (text, code, video, quiz) to keep it engaging.
    4.  'text' blocks should be well-written paragraphs.
    5.  'code' blocks must be useful and relevant.
    6.  'quiz' questions must be relevant to the content.
    7.  Ensure the entire output is a single, valid JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Use the new robust extractor
    return extractJson(text);
  } catch (error) {
    console.error("Error in generateLessonContent:", error);
    throw new Error("Failed to generate lesson content from AI");
  }
}

module.exports = {
  generateCourseOutline,
  generateLessonContent,
};
