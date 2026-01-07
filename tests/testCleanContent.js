/**
 * STEP 2.4 — Test Clean Content
 * Raw HTML text → Clean AI-safe text
 */

require("dotenv").config();

const { scrapePage } = require("../services/pageScraper/scrapePage");
const cleanContent = require("../services/contentCleaner/cleanContent");

(async () => {
  try {
    const url = "https://caketoppersindia.com/";

    console.log("🔍 Scraping page:", url);

    const page = await scrapePage(url);

    console.log("\n📏 RAW TEXT LENGTH:", page.text.length);

    const cleaned = cleanContent(page.text);

    console.log("📏 CLEANED TEXT LENGTH:", cleaned.length);

    console.log("\n🧹 CLEANED SAMPLE (first 500 chars):\n");
    console.log(cleaned.slice(0, 500));

    console.log("\n✅ STEP 2.4 TEST PASSED");
  } catch (err) {
    console.error("❌ STEP 2.4 TEST FAILED");
    console.error(err);
  }
})();
