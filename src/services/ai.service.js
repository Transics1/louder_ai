import axios from "axios";

const getFallbackResponse = (query) => {
  return {
    venueName: "Event Plan Generated",
    location: "Location based on your query",
    estimatedCost: "Varies based on requirements",
    whyItFits: `A custom event plan has been created for: ${query}`,
    highlights: [
      "Professional planning",
      "Budget-friendly options",
      "Flexible timing"
    ],
    bestTimeToVisit: "Flexible based on your availability",
    travelTips: [
      "Book in advance for better rates",
      "Consider off-season for cost savings"
    ]
  };
};

export const generateEventPlan = async (query) => {
    try {
        const prompt = `
                You are an expert AI Event & Trip Planner.
                Your task is to convert a user query into a highly realistic and structured event plan.
                STRICT RULES:
                - Return ONLY valid JSON (no explanation, no markdown, no backticks)
                - Output must be parseable with JSON.parse()
                - Do NOT include any extra text
                RESPONSE FORMAT:
                {
                "venueName": "string",
                "location": "string",
                "estimatedCost": "string (in INR per person if possible)",
                "whyItFits": "string",
                "highlights": ["string", "string", "string"],
                "bestTimeToVisit": "string",
                "travelTips": ["string", "string"]
                }
                GUIDELINES:
                - Make the venue realistic and specific (not generic like "nice place")
                - Match the user's constraints (budget, people, location, vibe)
                - If budget is low → suggest affordable options
                - If details are missing → make smart assumptions
                - Keep responses concise but useful
                - Cost should be believable (not random numbers)
                USER QUERY:
                "${query}"
                `;

        const res = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
            },
            { timeout: 15000 }
        );

        console.log("✅ Gemini API Success");
        const text =
            res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        console.log("Raw Gemini Response:", text.substring(0, 200) + "...");

        let cleaned = text.replace(/```json|```/g, "").trim();

        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");

        if (start === -1 || end === -1) {
            console.error("❌ Could not parse JSON from response");
            throw new Error("Invalid AI response format");
        }

        const jsonString = cleaned.substring(start, end + 1);
        const parsed = JSON.parse(jsonString);
        
        console.log("✅ Successfully parsed JSON:", parsed.venueName);
        return parsed;

    } catch (err) {
        console.error("❌ Gemini API Error:", {
            message: err.message,
            modelEndpoint: `gemini-1.5-flash`,
            status: err.response?.status,
            errorData: err.response?.data,
            apiKey: process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : "❌ Missing",
            timeout: err.code === "ECONNABORTED" ? "Request timeout" : "N/A"
        });
        console.log("⚠️  Falling back to default response");
        return getFallbackResponse(query);
    }
};