import "dotenv/config";
import axios from "axios";

const listGeminiModels = async () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("❌ GEMINI_API_KEY is not set in .env");
    process.exit(1);
  }

  try {
    console.log("🔍 Fetching available Gemini models...\n");

    const res = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    const models = res.data.models || [];

    if (models.length === 0) {
      console.log("❌ No models found for this API key");
      process.exit(1);
    }

    console.log(`✅ Found ${models.length} available models:\n`);
    console.log("=".repeat(80));

    models.forEach((model, index) => {
      console.log(`\n${index + 1}. ${model.name}`);
      console.log(`   Display Name: ${model.displayName || "N/A"}`);
      console.log(`   Version: ${model.version || "N/A"}`);
      console.log(`   Description: ${model.description || "N/A"}`);
      console.log(`   Input Token Limit: ${model.inputTokenLimit || "N/A"}`);
      console.log(`   Output Token Limit: ${model.outputTokenLimit || "N/A"}`);
      console.log(`   Supported Generation Methods: ${model.supportedGenerationMethods?.join(", ") || "N/A"}`);
    });

    console.log("\n" + "=".repeat(80));
    console.log("\n📌 Recommended models for text generation:");
    models.forEach((model) => {
      if (
        model.supportedGenerationMethods?.includes("generateContent") &&
        (model.name.includes("flash") || model.name.includes("pro"))
      ) {
        const modelId = model.name.split("/").pop();
        console.log(`   ✓ ${modelId}`);
      }
    });

  } catch (error) {
    console.error("❌ Error fetching models:");
    console.error("   Status:", error.response?.status);
    console.error("   Message:", error.response?.data?.error?.message || error.message);
    process.exit(1);
  }
};

listGeminiModels();
