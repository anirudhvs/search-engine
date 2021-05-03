const axios = require("../site/node_modules/axios");
const cheerio = require("../site/node_modules/cheerio");
const chalk = require("../site/node_modules/chalk");
let siteData = require("../site_data");

let sitesToVisit = [];
let visited = [];

const dfs = async () => {
  while (sitesToVisit.length !== 0 || siteData.length !== 0) {
    let last = sitesToVisit.length - 1;
    if (visited.indexOf(sitesToVisit[last]) !== -1) {
      sitesToVisit.pop();
      continue;
    }
    if (sitesToVisit.length === 0 && siteData.length !== 0) {
      sitesToVisit.push(siteData[0].site_url);
      last = 0;
    }

    const res = await axios.get(sitesToVisit[last]);

    const $ = cheerio.load(res.data);

    siteData = siteData.filter((site) => site.site_url !== sitesToVisit[last]);
    visited.push(sitesToVisit.pop());

    $("a").each((index, tag) => {
      var link = $(tag).attr("href");
      sitesToVisit.push(link);
    });
  }
};
t1 = Date.now();
dfs();
t2 = Date.now();
