require("dotenv").config();
const { scrapePage } = require("../services/pageScraper/scrapePage");

(async () => {
  const result = await scrapePage(
    "https://caketoppersindia.com/pages/shipping-policy"
  );

  console.log("Text length:", result.length);
  console.log(result.text.slice(0, 500)); // preview only
})();
