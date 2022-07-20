const pageScraper = require("./pageScraper");

async function scrapeAll(browserInstance, searchUsername) {
  let browser;
  try {
    browser = await browserInstance;
    return await pageScraper.scraper(browser, searchUsername);
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance, searchUsername) =>
  scrapeAll(browserInstance, searchUsername);
