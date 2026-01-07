require("dotenv").config();
const { expandSitemap } = require("../services/pageDiscovery/expandSitemap");

(async () => {
  const urls = await expandSitemap(
    "https://caketoppersindia.com/sitemap_products_1.xml",
    { maxUrls: 20 }
  );require("dotenv").config();
const { discoverPages } = require("../services/pageDiscovery/discoverPages");

(async () => {
  const url = "https://caketoppersindia.com";

  const pages = await discoverPages(url);
  console.log("Discovered pages:", pages.length);
  console.log(pages.slice(0, 10));
})();


  console.log("Expanded URLs:", urls.length);
  console.log(urls.slice(0, 5));
})();
