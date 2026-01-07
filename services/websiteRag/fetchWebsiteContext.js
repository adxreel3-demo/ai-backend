const { vectorSearch } = require("./vectorSearch");

async function fetchWebsiteContext({ companyId, userMessage }) {
  if (!companyId || !userMessage) return "";

  const chunks = await vectorSearch({
    companyId,
    query: userMessage,
    topK: 5
  });

  return chunks.join("\n\n");
}

module.exports = { fetchWebsiteContext };
