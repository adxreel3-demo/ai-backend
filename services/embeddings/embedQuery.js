require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MODEL = process.env.EMBEDDING_MODEL || "text-embedding-3-small";
const MAX_CHARS = 3000;

/**
 * Embed a single query string (runtime)
 * @param {string} text
 * @returns {number[]} embedding vector
 */
async function embedQuery(text) {
  if (!text || typeof text !== "string") {
    throw new Error("embedQuery: text must be a string");
  }

  const input =
    text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) : text;

  const response = await client.embeddings.create({
    model: MODEL,
    input
  });

  return response.data[0].embedding;
}

module.exports = { embedQuery };
