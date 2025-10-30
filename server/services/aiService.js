const {GoogleGenerativeAI} = require("@google/generative-ai");

// Initialize the Generative AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCourseContent(topic) {
  const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

  const prompt = `
    You are an expert instructional designer. Your task is to generate a full, multi-module course on a given topic.
    The topic is: "${topic}"

    You MUST generate the output in a single, valid JSON object. Do not include any text outside of the JSON.
    The JSON structure must follow this format:
    {
      "title": "Your Course Title",
      "description": "A brief overview of the course.",
      "modules": [
        {
          "title": "Module 1 Title",
          "lessons": [
            {
              "title": "Lesson 1.1 Title",
              "content": [
                { "type": "text", "content": "Start with a paragraph of text." },
                { "type": "code", "content": "console.log('Hello');", "language": "javascript" },
                { "type": "video", "content": "Search query for a relevant YouTube video, e.g., 'What are React Hooks?'" },
                { "type": "quiz", "content": "What is the capital of France?", "options": ["Paris", "London", "Berlin"], "correctAnswer": "Paris" }
              ]
            },
            {
              "title": "Lesson 1.2 Title",
              "content": [
                { "type": "text", "content": "Another paragraph." },
                { "type": "text", "content": "More text." }
              ]
            }
          ]
        },
        {
          "title": "Module 2 Title",
          "lessons": [
            {
              "title": "Lesson 2.1 Title",
              "content": [
                { "type": "text", "content": "Content for lesson 2.1..." }
              ]
            }
          ]
        }
      ]
    }

    Instructions:
    1.  Generate 2-3 modules.
    2.  Generate 2-3 lessons per module.
    3.  For each lesson, create an array of 3-5 content blocks.
    4.  Vary the content block types ('text', 'code', 'video', 'quiz').
    5.  Ensure the entire output is a single, valid JSON object. Do not wrap it in markdown \`\`\`json ... \`\`\`.
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response text to ensure it's valid JSON
    const jsonText = text.replace(/^```json\s*/, "").replace(/```$/, "");

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating AI content:", error);
    throw new Error("Failed to generate course content from AI");
  }
}

module.exports = {generateCourseContent};
