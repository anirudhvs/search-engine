const axios = require("axios");
const cheerio = require("cheerio");
const chalk = require("chalk");

let sitesYetToVisit = require("../site_data");
let insert = require("./insert");
let sitesToVisit = [];
let visited = [];

const bfs = async () => {
  while (sitesToVisit.length !== 0 || sitesYetToVisit.length !== 0) {
    if (sitesToVisit.length === 0 && sitesYetToVisit.length != 0) {
      sitesToVisit.push(sitesYetToVisit[0].site_url);
    }

    if (visited.indexOf(sitesToVisit[0]) !== -1) {
      sitesToVisit.shift();
      continue;
    }
    // console.log(chalk.green("Sites to Visit: ", sitesToVisit.length));
    console.log(chalk.green(`Unvisited sites from total: ${sitesYetToVisit.length}`));
    console.log(chalk.blue(`Visiting ${sitesToVisit[0]}`));

    const res = await axios.get(sitesToVisit[0]);

    const $ = cheerio.load(res.data);

    $("h1").each((index, tag) => {
      insert.Head(tag.children[0].data, sitesToVisit[0]);
    });

    $("p").each((index, tag) => {
      insert.Ptag(tag.children[0].data, sitesToVisit[0]);
    });

    $("a").each((index, tag) => {
      var link = $(tag).attr("href");
      sitesToVisit.push(link);
    });
    sitesYetToVisit = sitesYetToVisit.filter((site) => site.site_url !== sitesToVisit[0]);
    visited.push(sitesToVisit.shift());
  }
};

const dfs = async () => {
  while (sitesToVisit.length !== 0 || sitesYetToVisit.length !== 0) {
    if (sitesToVisit.length === 0 && sitesYetToVisit.length != 0) {
      sitesToVisit.push(sitesYetToVisit[0].site_url);
    }

    const last = sitesToVisit.length - 1;
    if (visited.indexOf(sitesToVisit[last]) !== -1) {
      //console.log(chalk.red(`Sites to Visit: ${sitesToVisit.length}`))
      sitesToVisit.pop();
      continue;
    }
    console.log(chalk.green(`Sites to Visit: ${sitesToVisit.length}`));
    //console.log(chalk.grey(sitesToVisit))
    console.log(chalk.green(`Unvisited sites from total: ${sitesYetToVisit.length}`));
    console.log(chalk.blue(`Visiting ${sitesToVisit[last]}`));

    const res = await axios.get(sitesToVisit[last]);

    const $ = cheerio.load(res.data);

    sitesYetToVisit = sitesYetToVisit.filter((site) => site.site_url !== sitesToVisit[last]);
    visited.push(sitesToVisit.pop());

    $("h1").each((index, tag) => {
      insert.Head(tag.children[0].data, sitesToVisit[last]);
    });

    $("p").each((index, tag) => {
      insert.Ptag(tag.children[0].data, sitesToVisit[last]);
    });

    $("a").each((index, tag) => {
      var link = $(tag).attr("href");
      // console.log(chalk.grey(`Adding Site ${link}`));
      sitesToVisit.push(link);
    });
  }
};


module.exports = {
  bfs,
  dfs,
};
