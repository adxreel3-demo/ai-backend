require("dotenv").config();
const expandSitemap = require("../services/pageDiscovery/expandSitemap");

(async () => {
  const urls = await expandSitemap("https://caketoppersindia.com/sitemap.xml");
  console.log("Total URLs:", urls.length);
  console.log(urls.slice(0, 10));
})();
