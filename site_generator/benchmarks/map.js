const siteData = require("../site_data.json");

class map {
	constructor() {
		this.stringsmap = {};
	}

	insert(string, url) {
		if (!/^[a-zA-Z]+$/.test(string)) return;
		string = string.toLowerCase();
		if (this.stringsmap[string]) {
			this.stringsmap[string].push(url);
		} else {
			this.stringsmap[string] = [];
			this.stringsmap[string].push(url);
		}
	}

	search(key) {
		if (this.stringsmap[key]) return this.stringsmap[key];
		else return [];
	}
}

mapHead = new map();
mapPtag = new map();

t1 = Date.now();
siteData.forEach((site) => {
	data = site.title.split(/[^A-Za-z]/);
	Object.values(data).forEach((datum) => {
		mapHead.insert(datum, site.site_url);
	});
	data = site.body.split(/[^A-Za-z]/);
	Object.values(data).forEach((datum) => {
		mapPtag.insert(datum, site.site_url);
	});
});
t2 = Date.now();
console.log(t2 - t1);
