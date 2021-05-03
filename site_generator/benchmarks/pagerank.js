let siteData = require("../site_data.json");

const inboundContribution = (inboundLinks) => {
	return inboundLinks.reduce((accumulator, currentvalue) => {
		const contribution = currentvalue.rank / currentvalue.links.length;
		return accumulator + contribution;
	}, 0);
};

const pageRank = (iterations, damping) => {
	siteData = siteData.map((site) => {
		site.rank = 1;
		return site;
	});

	for (let i = 0; i < iterations; i++) {
		siteData.forEach((site, index, array) => {
			const inboundLinks = siteData.filter((insite) => {
				return insite.links.includes(index);
			});
			array[index].rank =
				1 - damping + damping * inboundContribution(inboundLinks);
		});
	}
	const ranking = {};
	siteData.forEach((site) => {
		ranking[site.site_url] = site.rank;
	});
};
let result = {
	iterations: [],
	time: [],
};
// for (let i = 1; i <= process.argv[2]; i++) {
// 	let t1 = Date.now();
// 	pageRank(i, 0.85);
// 	let t2 = Date.now();
// 	result.iterations.push(i);
// 	result.time.push((t2 - t1) / 1000);
// }
// console.log(result);
let t1 = Date.now();
pageRank(100, 0.85);
let t2 = Date.now();
console.log(t2 - t1);
