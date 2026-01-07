const db = require("../../config/db");
const { embedQuery } = require("../embeddings/embedQuery");

/**
 * Vector similarity search using cosine similarity
 */
async function vectorSearch({ companyId, query, topK = 5 }) {
  const queryEmbedding = await embedQuery(query);

  const [rows] = await db.query(
    `SELECT clean_content, embedding
     FROM website_knowledge
     WHERE company_id = ?
       AND is_active = 1
       AND embedding IS NOT NULL`,
    [companyId]
  );

  const scored = rows.map((row) => {
    const emb = JSON.parse(row.embedding);
    return {
      text: row.clean_content,
      score: cosineSimilarity(queryEmbedding, emb)
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((r) => r.text);
}

function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] ** 2;
    magB += b[i] ** 2;
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

module.exports = { vectorSearch };
