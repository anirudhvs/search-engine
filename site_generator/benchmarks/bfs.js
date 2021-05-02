const axios = require("../site/node_modules/axios");
const cheerio = require("../site/node_modules/cheerio");
const chalk = require("../site/node_modules/chalk");
let siteData = require("../site_data");

let sitesToVisit = [];
let visited = [];

const bfs = async () => {
	while (sitesToVisit.length !== 0 || siteData.length !== 0) {
		if (visited.indexOf(sitesToVisit[0]) !== -1) {
			sitesToVisit.shift();
			continue;
		}
		if (sitesToVisit.length === 0 && siteData.length != 0) {
			sitesToVisit.push(siteData[0].site_url);
		}
		const res = await axios.get(sitesToVisit[0]);
		const $ = cheerio.load(res.data);

		$("a").each((index, tag) => {
			var link = $(tag).attr("href");
			sitesToVisit.push(link);
		});
		siteData = siteData.filter((site) => site.site_url !== sitesToVisit[0]);
		visited.push(sitesToVisit.shift());
	}
};

bfs();
