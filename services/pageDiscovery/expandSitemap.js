const axios = require("axios");
const xml2js = require("xml2js");

async function expandSitemap(sitemapUrl) {
  try {
    const res = await axios.get(sitemapUrl, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AI-Bot/1.0)"
      }
    });

    if (!res.data) return [];

    const parsed = await xml2js.parseStringPromise(res.data);

    // CASE 1: sitemap index (contains child sitemaps)
    if (parsed.sitemapindex?.sitemap) {
      const childSitemaps = parsed.sitemapindex.sitemap.map(
        s => s.loc[0]
      );

      let urls = [];
      for (const child of childSitemaps) {
        const childUrls = await expandSitemap(child);
        urls.push(...childUrls);
      }
      return urls;
    }

    // CASE 2: urlset (actual pages)
    if (parsed.urlset?.url) {
      return parsed.urlset.url.map(u => u.loc[0]);
    }

    return [];
  } catch (err) {
    console.warn(`⚠️ Failed sitemap: ${sitemapUrl}`);
    return [];
  }
}

module.exports = expandSitemap;
