import axios from "axios";

export const generateEventPlan = async (query) => {
  try {
    const prompt = `
You are an AI Event Planner.

Return ONLY valid JSON:
{
  "venueName": "",
  "location": "",
  "estimatedCost": "",
  "whyItFits": ""
}

User request: ${query}
`;

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const text = res.data.candidates[0].content.parts[0].text;

    const cleaned = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    throw new Error("AI failed");
  }
};