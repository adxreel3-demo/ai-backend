// services/embeddings/embedWebsiteContent.js
require("dotenv").config();
const OpenAI = require("openai");
const db = require("../../config/db");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MODEL = process.env.EMBEDDING_MODEL || "text-embedding-3-small";
const BATCH_SIZE = 10;
const MAX_CHARS = 3000;

async function fetchRows(limit = 100) {
  const [rows] = await db.query(
    `SELECT id, clean_content
     FROM website_knowledge
     WHERE is_active = 1
       AND (embedding IS NULL OR embedding = '')
     LIMIT ?`,
    [limit]
  );
  return rows;
}

async function saveEmbedding(id, embedding) {
  await db.query(
    `UPDATE website_knowledge
     SET embedding = ?
     WHERE id = ?`,
    [JSON.stringify(embedding), id]
  );
}

async function embedWebsiteContent({ limit = 100 } = {}) {
  const rows = await fetchRows(limit);
  if (!rows.length) {
    return { embedded: 0 };
  }

  let embedded = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    const inputs = batch.map(r =>
      (r.clean_content || "").slice(0, MAX_CHARS)
    );

    const res = await client.embeddings.create({
      model: MODEL,
      input: inputs
    });

    for (let j = 0; j < batch.length; j++) {
      await saveEmbedding(batch[j].id, res.data[j].embedding);
      embedded++;
    }

    await new Promise(r => setTimeout(r, 200)); // rate limit safety
  }

  return { embedded };
}

module.exports = { embedWebsiteContent };
