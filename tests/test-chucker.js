// tests/test-chunker.js
require("dotenv").config();

const { scrapePage } = require("../services/pageScraper/scrapePage");
const cleanContent = require("../services/contentCleaner/cleanContent");
const { chunkText } = require("../services/contentChunker/chunkText");

(async () => {
  const page = await scrapePage("https://caketoppersindia.com/");
  const cleaned = cleanContent(page.text);
  const chunks = chunkText(cleaned);

  console.log("RAW LENGTH:", page.text.length);
  console.log("CLEANED LENGTH:", cleaned.length);
  console.log("CHUNKS:", chunks.length);
  console.log("\nFIRST CHUNK:\n", chunks[0].slice(0, 300));
})();
