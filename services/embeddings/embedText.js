// services/embeddings/embedText.js
require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MODEL = process.env.EMBEDDING_MODEL || "text-embedding-3-small";

/**
 * Embed a single text string
 */
async function embedText(text) {
  if (!text || typeof text !== "string") {
    throw new Error("embedText: invalid text input");
  }

  const response = await client.embeddings.create({
    model: MODEL,
    input: text.slice(0, 3000) // safety limit
  });

  return response.data[0].embedding;
}

module.exports = { embedText };
