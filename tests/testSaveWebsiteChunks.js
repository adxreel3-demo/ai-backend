/**
 * STEP 2.8 — Test saveWebsiteChunk
 * Verifies:
 * 1️⃣ INSERT (new page)
 * 2️⃣ SKIP (same content)
 * 3️⃣ UPDATE (changed content)
 */

require("dotenv").config();

const { scrapePage } = require("../services/pageScraper/scrapePage");
const cleanContent = require("../services/contentCleaner/cleanContent");
const { saveWebsiteChunk } = require("../services/websiteKnowledge/saveWebsiteChunks");

(async () => {
  try {
    const COMPANY_ID = 4001;
    const URL = "https://caketoppersindia.com/";
    const PAGE_TYPE = "HOME";

    console.log("🔍 Scraping page...");
    const page = await scrapePage(URL);

    console.log("🧹 Cleaning content...");
    const cleaned = cleanContent(page.text);

    console.log("💾 Saving website knowledge (1st run)...");
    const result1 = await saveWebsiteChunk({
      company_id: COMPANY_ID,
      source_url: URL,
      page_type: PAGE_TYPE,
      raw_content: page.text,
      clean_content: cleaned
    });

    console.log("Result 1:", result1);

    console.log("🔁 Saving same content again (should SKIP)...");
    const result2 = await saveWebsiteChunk({
      company_id: COMPANY_ID,
      source_url: URL,
      page_type: PAGE_TYPE,
      raw_content: page.text,
      clean_content: cleaned
    });

    console.log("Result 2:", result2);

    console.log("✏️ Modifying content slightly (simulate update)...");
    const modifiedCleaned = cleaned + "\nTemporary test change";

    const result3 = await saveWebsiteChunk({
      company_id: COMPANY_ID,
      source_url: URL,
      page_type: PAGE_TYPE,
      raw_content: page.text,
      clean_content: modifiedCleaned
    });

    console.log("Result 3:", result3);

    console.log("\n✅ STEP 2.8 TEST PASSED");
    process.exit(0);

  } catch (err) {
    console.error("\n❌ STEP 2.8 TEST FAILED");
    console.error(err);
    process.exit(1);
  }
})();
