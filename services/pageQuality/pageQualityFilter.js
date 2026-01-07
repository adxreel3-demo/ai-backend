/**
 * Decide if a scraped page is useful for AI knowledge
 */
function isPageUseful({ text }) {
  if (!text) return false;

  // Rule 1: Minimum length
  if (text.length < 500) return false;

  // Normalize words
  const words = text.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);

  // Rule 2: Noise detection
  const uniqueRatio = uniqueWords.size / words.length;
  if (uniqueRatio < 0.2) return false; // too repetitive

  return true;
}

module.exports = { isPageUseful };
