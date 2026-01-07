const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Fetches a web page and extracts clean readable text
 */
async function scrapePage(url) {
  try {
    const { data: html } = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0 (AI-Knowledge-Bot)",
      },
    });

    const $ = cheerio.load(html);

    // ❌ Remove junk
    $("script, style, noscript, iframe, svg").remove();

    // ✅ Extract visible text
    let text = $("body").text();

    // 🧹 Normalize
    text = text
      .replace(/\s+/g, " ")
      .replace(/\n+/g, "\n")
      .trim();

    return {
      url,
      text,
      length: text.length,
    };
  } catch (err) {
    return {
      url,
      error: err.message,
    };
  }
}

module.exports = { scrapePage };
