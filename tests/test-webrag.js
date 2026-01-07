const { fetchWebsiteContext } = require("../services/websiteRag/fetchWebsiteContext");

(async () => {
  const context = await fetchWebsiteContext({
    companyId: 4001,
    userMessage: "delivery policy"
  });

  console.log(context);
})();
