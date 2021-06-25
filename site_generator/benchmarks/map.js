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

mapPtag = new map();

// t1 = Date.now();
// siteData.forEach((site) => {
// 	data = site.title.split(/[^A-Za-z]/);
// 	Object.values(data).forEach((datum) => {
// 		mapHead.insert(datum, site.site_url);
// 	});
// 	data = site.body.split(/[^A-Za-z]/);
// 	Object.values(data).forEach((datum) => {
// 		mapPtag.insert(datum, site.site_url);
// 	});
// });
// t2 = Date.now();
// console.log(t2 - t1);

var k=0, flag=0;
for(var i=0;i<siteData.length;i++){
	site = siteData[i]
	data = site.body.split(/[^A-Za-z]/);
	for(var j=0;j<Object.values(data).length;j++){
		datum = data[j]
		mapPtag.insert(datum, site.site_url);
		k++;
		if(k>=process.argv[2]+100){
			flag=1
			break;
		}
	}
	if(flag==1){
		break
	}
}

t1 = Date.now();
var k=0, flag=0;
for(var i=0;i<siteData.length;i++){
	site = siteData[i]
	data = site.body.split(/[^A-Za-z]/);
	for(var j=0;j<Object.values(data).length;j++){
		datum = data[j]
		mapPtag.search(datum);
		k++;
		if(k>=process.argv[2]){
			flag=1
			break;
		}
	}
	if(flag==1){
		break
	}
}
t2 = Date.now();
console.log(t2 - t1);
