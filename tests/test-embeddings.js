require("dotenv").config();
const { embedWebsiteContent } = require("../services/embeddings/embedWebsiteContent");

(async () => {
  const count = await embedWebsiteContent({
    companyId: 4001,
    limit: 5
  });

  console.log("Embedded rows:", count);
})();
