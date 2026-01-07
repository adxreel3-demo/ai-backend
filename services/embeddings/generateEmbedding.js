require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate embedding for ONE text (query-time)
 */
async function generateEmbedding(text) {
  if (!text || typeof text !== "string") return null;

  const response = await client.embeddings.create({
    model: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
    input: text.slice(0, 3000) // safety truncate
  });

  return response.data[0].embedding;
}

module.exports = { generateEmbedding };
