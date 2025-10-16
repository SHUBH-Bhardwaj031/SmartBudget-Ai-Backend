// controllers/ai.controller.js
import geminiClient from "../config/gemini.js";

export const chatbotResponse = async (req, resp) => {
  try {
    const { message } = req.body;
    if (!message) return resp.status(400).json({ text: "Message is required", success: false });

    const SYSTEM_PROMPT = `
You are an expert AI assistant focused on expense, budget, and finance tips. Keep answers simple and under 200 words.
Only answer questions related to expenses or finance.
`;

    const responseText = await geminiClient.generate(message, SYSTEM_PROMPT);

    return resp.status(200).json({
      text: responseText.trim(),
      success: true,
    });
  } catch (err) {
    console.error("AI Controller Error:", err);
    return resp.status(500).json({ text: "⚠️ Error generating AI response", success: false });
  }
};