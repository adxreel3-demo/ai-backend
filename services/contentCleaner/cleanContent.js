/**
 * STEP 2.4.2 — Clean Content
 * Generic, production-safe cleaner for website text
 */

function cleanContent(rawText = "") {
  if (!rawText || typeof rawText !== "string") return "";

  let text = rawText;

  /* ----------------------------------------
     1️⃣ Normalize encoding & whitespace
  ---------------------------------------- */
  text = text
    .replace(/\u00a0/g, " ")     // non-breaking space
    .replace(/\t+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ ]{2,}/g, " ")
    .trim();

  /* ----------------------------------------
     2️⃣ Remove very common navigation junk
     (generic words, not site-specific)
  ---------------------------------------- */
  const NAVIGATION_PATTERNS = [
    /skip to content/i,
    /home\s+/i,
    /search\s+/i,
    /account\s+/i,
    /cart\s*/i,
    /menu\s*/i,
    /login\s*/i,
    /register\s*/i
  ];

  NAVIGATION_PATTERNS.forEach((pattern) => {
    text = text.replace(pattern, "");
  });

  /* ----------------------------------------
     3️⃣ Remove footer/legal boilerplate
  ---------------------------------------- */
  const FOOTER_PATTERNS = [
    /©\s*\d{4}.*/i,
    /all rights reserved/i,
    /powered by/i,
    /privacy policy/i,
    /terms of service/i,
    /refund policy/i,
    /shipping policy/i
  ];

  FOOTER_PATTERNS.forEach((pattern) => {
    text = text.replace(pattern, "");
  });

  /* ----------------------------------------
     4️⃣ Remove repetitive category spam
     (detect repeated words appearing too often)
  ---------------------------------------- */
  const words = text.split(/\s+/);
  const wordFrequency = {};

  words.forEach((w) => {
    const key = w.toLowerCase();
    wordFrequency[key] = (wordFrequency[key] || 0) + 1;
  });

  text = words
    .filter((w) => {
      const key = w.toLowerCase();
      return wordFrequency[key] < 30; // removes nav/category loops
    })
    .join(" ");

  /* ----------------------------------------
     5️⃣ Final cleanup
  ---------------------------------------- */
  text = text
    .replace(/\n{2,}/g, "\n")
    .replace(/[ ]{2,}/g, " ")
    .trim();

  return text;
}

module.exports = cleanContent;
