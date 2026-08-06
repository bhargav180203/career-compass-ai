// backend/controllers/aiController.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  });

export const getCareerRecommendation = async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({
        success: false,
        message: "Please provide user input",
      });
    }

    const prompt = `
You are an expert career counselor.
Based on the user's interests and skills, suggest 2–3 career paths.
Keep it concise (3–4 sentences).

User input: ${userInput}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({
      success: true,
      aiResponse: response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};