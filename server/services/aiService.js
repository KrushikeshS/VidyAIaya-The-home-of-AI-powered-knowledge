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
 * Generates a comprehensive course outline with dynamic structure based on topic complexity.
 */
async function generateCourseOutline(topic, options = {}) {
  const {
    targetAudience = "beginners with no prior experience",
    learningGoals = null,
    estimatedDuration = null,
  } = options;

  const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

  const prompt = `
You are a world-class instructional designer and curriculum developer with expertise across multiple domains.

Your task is to create a comprehensive, pedagogically sound course outline for: "${topic}"

Target Audience: ${targetAudience}
${learningGoals ? `Specific Learning Goals: ${learningGoals}` : ""}
${estimatedDuration ? `Estimated Course Duration: ${estimatedDuration}` : ""}

CRITICAL INSTRUCTIONS:
1. Analyze the topic's complexity and breadth to determine the OPTIMAL number of modules (typically 4-8, but use your expertise)
2. Each module should represent a major learning milestone or conceptual shift
3. Design 4-8 lessons per module based on the depth required for mastery
4. Follow pedagogical best practices: start with fundamentals, build progressively, end with advanced applications
5. Use clear, engaging titles that communicate value to the learner
6. Ensure logical flow: each lesson should build on previous ones

OUTPUT FORMAT (valid JSON only, no additional text):
{
  "title": "Professional, engaging course title",
  "description": "Compelling 2-3 sentence course description that explains what students will achieve and why it matters",
  "targetAudience": "${targetAudience}",
  "prerequisites": ["List any assumed knowledge or skills"],
  "learningOutcomes": ["Specific skill 1 students will gain", "Specific skill 2", "Specific skill 3"],
  "modules": [
    {
      "title": "Module title that clearly indicates the learning focus",
      "description": "1-2 sentence overview of what this module covers and why it's important",
      "lessons": [
        { 
          "title": "Descriptive lesson title that indicates specific learning content",
          "description": "Brief 1-sentence description of what this lesson covers"
        }
      ]
    }
  ]
}

QUALITY STANDARDS:
- Module titles should be action-oriented when possible (e.g., "Building Your First..." not just "Introduction")
- Lesson titles should be specific (e.g., "Understanding State Management with useState" not "React Hooks")
- The progression should feel natural and motivating
- Include both theoretical foundations and practical applications
- The outline should inspire confidence that the course is comprehensive

Generate the outline now. Remember: ONLY output valid JSON, no markdown, no explanations.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return extractJson(text);
  } catch (error) {
    console.error("Error in generateCourseOutline:", error);
    throw new Error("Failed to generate course outline from AI");
  }
}

/**
 * Generates rich, comprehensive content for a single lesson with context awareness.
 */
async function generateLessonContent(
  lessonTitle,
  lessonDescription,
  moduleTitle,
  courseTitle,
  options = {}
) {
  const {
    previousLessonSummary = null,
    targetAudience = "beginners",
    focusAreas = [],
  } = options;

  const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

  const prompt = `
You are an expert educator creating a comprehensive, engaging lesson for an online course.

CONTEXT:
- Course: "${courseTitle}"
- Module: "${moduleTitle}"
- Lesson: "${lessonTitle}"
- Lesson Focus: "${lessonDescription}"
- Target Audience: ${targetAudience}
${
  previousLessonSummary
    ? `- Previous Lesson Covered: ${previousLessonSummary}`
    : ""
}
${focusAreas.length > 0 ? `- Special Focus: ${focusAreas.join(", ")}` : ""}

YOUR MISSION:
Create a deep, thorough lesson that truly teaches this concept. Don't just scratch the surface—this should be something a student could learn from and apply immediately.

CONTENT BLOCK TYPES YOU CAN USE:
1. "text" - Explanatory paragraphs (use for concepts, context, explanations)
2. "heading" - Section headers to organize content
3. "code" - Code examples with language specified
4. "video" - Specific, high-quality YouTube search queries
5. "quiz" - Multiple choice questions with 4 options
6. "exercise" - Hands-on practice challenges
7. "callout" - Important notes, tips, warnings (specify calloutType: "info", "warning", "tip", "success")
8. "list" - Bullet points for key concepts (specify listType: "bullet" or "numbered")

CONTENT STRUCTURE REQUIREMENTS:
1. START with a compelling introduction (1-2 text blocks) that explains WHY this matters
2. PRESENT core concepts with clear explanations (2-3 text/heading blocks)
3. DEMONSTRATE with practical examples (1-2 code blocks with thorough comments)
4. REINFORCE with a video resource (1 video block with specific search query)
5. PRACTICE with exercises or quizzes (2-3 blocks)
6. ADD callouts for key insights, common pitfalls, or pro tips (1-2 blocks)
7. CONCLUDE with a summary and preview of what's next (1 text block)

AIM FOR 10-15 CONTENT BLOCKS for a comprehensive lesson.

OUTPUT FORMAT (valid JSON only):
{
  "content": [
    { "type": "heading", "content": "Introduction: [Engaging Section Title]" },
    { "type": "text", "content": "Detailed explanatory paragraph..." },
    { "type": "callout", "calloutType": "tip", "content": "Pro tip or important note..." },
    { "type": "code", "content": "// Well-commented code example\\nconsole.log('hello');", "language": "javascript" },
    { "type": "list", "listType": "bullet", "content": ["Point 1", "Point 2", "Point 3"] },
    { "type": "video", "content": "Specific YouTube search query for high-quality tutorial" },
    { "type": "quiz", "content": "Clear, relevant question?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": "Option A", "explanation": "Why this is correct..." },
    { "type": "exercise", "content": "Hands-on challenge: Build a feature that...", "hint": "Optional hint for students" }
  ]
}

QUALITY STANDARDS:
- Text blocks should be 3-5 sentences minimum, thoroughly explaining concepts
- Code examples must be practical, well-commented, and runnable
- Video queries should be specific (e.g., "Advanced React useEffect cleanup patterns tutorial" not "React hooks")
- Quiz questions should test understanding, not just memorization
- Exercises should be challenging but achievable
- Use callouts strategically for key insights
- Maintain an encouraging, clear teaching voice throughout

Generate comprehensive lesson content now. ONLY output valid JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return extractJson(text);
  } catch (error) {
    console.error("Error in generateLessonContent:", error);
    throw new Error("Failed to generate lesson content from AI");
  }
}

/**
 * Optional: Generate a course overview/introduction
 */
async function generateCourseIntroduction(courseOutline) {
  const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

  const prompt = `
You are creating a welcoming, motivating introduction for an online course.

Course Title: "${courseOutline.title}"
Course Description: "${courseOutline.description}"
Target Audience: ${courseOutline.targetAudience}

Create an engaging course introduction that:
1. Welcomes students and builds excitement
2. Explains what they'll achieve by the end
3. Outlines the learning journey
4. Sets expectations and encourages persistence

OUTPUT FORMAT (valid JSON only):
{
  "content": [
    { "type": "heading", "content": "Welcome to ${courseOutline.title}" },
    { "type": "text", "content": "Engaging welcome message..." },
    { "type": "heading", "content": "What You'll Learn" },
    { "type": "list", "listType": "numbered", "content": ["Outcome 1", "Outcome 2", "Outcome 3"] },
    { "type": "heading", "content": "Your Learning Journey" },
    { "type": "text", "content": "Overview of the course structure..." },
    { "type": "callout", "calloutType": "success", "content": "Motivational message about their decision to learn this..." }
  ]
}

Generate the introduction now. ONLY output valid JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return extractJson(text);
  } catch (error) {
    console.error("Error in generateCourseIntroduction:", error);
    throw new Error("Failed to generate course introduction from AI");
  }
}

module.exports = {
  generateCourseOutline,
  generateLessonContent,
  generateCourseIntroduction,
};
