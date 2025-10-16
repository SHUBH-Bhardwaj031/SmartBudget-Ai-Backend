// config/gemini.js
import axios from "axios";

const GEMINI_API_KEY = GEMINI_API_KEYS;

const geminiClient = {
  generate: async (userMessage, systemPrompt = "") => {
    try {
      const fullPrompt = `${systemPrompt}\n\nUser Query: ${userMessage}`;

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [{ parts: [{ text: fullPrompt }] }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY,
          },
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini API error:", error.response?.data || error.message);
      throw new Error("Could not fetch AI response");
    }
  },
};

export default geminiClient;
