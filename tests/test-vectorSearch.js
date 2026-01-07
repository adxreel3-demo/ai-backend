require("dotenv").config();
const { vectorSearch } = require("../services/websiteRag/vectorSearch");

(async () => {
  const results = await vectorSearch({
    companyId: 4001,
    query: "delivery policy",
    limit: 3
  });

  console.log("Top matches:\n");
  results.forEach((r, i) => {
    console.log(`#${i + 1} (score: ${r.score.toFixed(3)})`);
    console.log(r.content.slice(0, 200), "\n");
  });
})();
