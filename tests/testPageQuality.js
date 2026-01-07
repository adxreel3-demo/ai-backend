require("dotenv").config();
const { scrapePage } = require("../services/pageScraper/scrapePage");
const { isPageUseful } = require("../services/pageQuality/pageQualityFilter");

(async () => {
  const page = await scrapePage(
    "https://caketoppersindia.com/"
  );

  console.log("Length:", page.length);
  console.log("Useful?", isPageUseful(page));
})();
