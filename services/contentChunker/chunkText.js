/**
 * STEP 2.5 — Chunk Content
 * Simple, production-safe text chunker
 */

function chunkText(
  text,
  { chunkSize = 1000, overlap = 150 } = {}
) {
  if (!text || typeof text !== "string") return [];

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    const chunk = text.slice(start, end).trim();

    // Avoid tiny / useless chunks
    if (chunk.length > 100) {
      chunks.push(chunk);
    }

    start += chunkSize - overlap;
  }

  return chunks;
}

module.exports = { chunkText };
