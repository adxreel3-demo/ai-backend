const axios = require("axios");
const xml2js = require("xml2js");

async function discoverFromSitemap(baseUrl, limit = 300) {
  const sitemapUrls = [
    `${baseUrl}/sitemap.xml`,
    `${baseUrl}/sitemap_index.xml`
  ];

  const pages = new Set();

  for (const sitemapUrl of sitemapUrls) {
    try {
      const res = await axios.get(sitemapUrl, { timeout: 10000 });
      const parsed = await xml2js.parseStringPromise(res.data);

      const urls =
        parsed.urlset?.url ||
        parsed.sitemapindex?.sitemap ||
        [];

      for (const u of urls) {
        const loc = u.loc?.[0];
        if (loc && loc.startsWith(baseUrl)) {
          pages.add(loc);
          if (pages.size >= limit) break;
        }
      }

      if (pages.size) break; // sitemap found, stop fallback
    } catch (e) {
      // silently try next sitemap
    }
  }

  return Array.from(pages);
}

module.exports = { discoverFromSitemap };
