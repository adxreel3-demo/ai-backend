const { discoverFromSitemap } = require("./sitemapDiscovery");
const { discoverFromHomepage } = require("./homepageDiscovery");

async function discoverPages(baseUrl, limit = 300) {
  let pages = await discoverFromSitemap(baseUrl, limit);

  if (!pages.length) {
    pages = await discoverFromHomepage(baseUrl, limit);
  }

  return pages;
}

module.exports = { discoverPages };
