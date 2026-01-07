const { embedWebsiteContent } = require("../services/embeddings/embedWebsiteContent");

(async () => {
  const res = await embedWebsiteContent({ limit: 20 });
  console.log("Result:", res);
})();
