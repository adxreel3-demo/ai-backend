const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("url");

async function discoverFromHomepage(baseUrl, limit = 200) {
  const pages = new Set();

  const res = await axios.get(baseUrl, { timeout: 10000 });
  const $ = cheerio.load(res.data);

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    try {
      const url = new URL(href, baseUrl);
      if (url.origin === new URL(baseUrl).origin) {
        pages.add(url.href);
      }
    } catch {}
  });

  return Array.from(pages).slice(0, limit);
}

module.exports = { discoverFromHomepage };
