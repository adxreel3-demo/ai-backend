const { saveWebsiteChunk } = require("../services/websiteKnowledge/saveWebsiteChunk");

(async () => {
  const result = await saveWebsiteChunk({
    company_id: 1,
    source_url: "https://example.com/about",
    page_type: "ABOUT",
    raw_content: "About us text",
    clean_content: "About us text"
  });

  console.log("RESULT:", result);
})();

