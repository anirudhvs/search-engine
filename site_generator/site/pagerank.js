const fs = require('fs');

let siteData = require("../site_data.json");

// const inboundContribution = (inboundLinks) => {
//   return inboundLinks.reduce((accumulator, currentvalue) => {
//     const contribution = currentvalue.rank / currentvalue.links.length;
//     return accumulator + contribution;
//   }, 0);
// };

const pageRank = (iterations, damping) => {
  let N = siteData.length;
  let initialRank = 1 / N;

  for (let i = 0; i < siteData.length; i++) {
    siteData[i].rank = initialRank;
    for (let j = 0; j < siteData[i].links.length; j++) {
      let sink = siteData[i].links[j];
      if (siteData[sink].inbound === undefined) siteData[sink].inbound = []
      siteData[sink].inbound.push(i);
    }
  }
  for (let i = 0; i < siteData.length; i++) {
    if (siteData[i].inbound === undefined) siteData[i].inbound = [];
    let visited = {};
    let unique = []
    for (let j = 0; j < siteData[i].inbound.length; j++) {
      if (visited[siteData[i].inbound[j]] !== undefined || siteData[i].inbound[j] == i) continue;
      visited[siteData[i].inbound[j]] = 1
      unique.push(siteData[i].inbound[j]);
    }
    siteData[i].inbound = unique;
    siteData[i].links = siteData[i].links.filter((e, pos, a) => a.indexOf(e) === pos && e !== i);
    // console.log(i, siteData[i].links, siteData[i].inbound);
  }
  // console.log(siteData)

  while (iterations--) {
    let sum = 0;
    let preCalc = (1 - damping) / N;
    console.log("preCalc", preCalc)
    let dp = 0;
    for (let i = 0; i < siteData.length; i++) {
      if (siteData[i].links.length === 0)
        dp += (damping * siteData[i].rank) / N;
    }
    for (let i = 0; i < siteData.length; i++) {
      let inboundContribution = 0;
      for (let j = 0; j < siteData[i].inbound.length; j++) {
        // console.log(i, j, siteData[i].inbound[j], siteData[siteData[i].inbound[j]].rank, siteData[siteData[i].inbound[j]].links.length, siteData[siteData[i].inbound[j]].rank / siteData[siteData[i].inbound[j]].links.length);
        inboundContribution += siteData[siteData[i].inbound[j]].rank / siteData[siteData[i].inbound[j]].links.length;
      }

      siteData[i].rank = dp + preCalc + damping * inboundContribution;
      console.log("rankset", i, siteData[i].rank)
      sum += siteData[i].rank
    }
    console.log("finally", iterations, sum)
  }
  const ranking = {};
  siteData.forEach((site) => {
    ranking[site.site_url] = site.rank;
  });
  fs.writeFileSync('./site_rank_data.json', JSON.stringify(siteData));

  //console.log(ranking);
  return ranking;
};

module.exports = pageRank;

pageRank(100, 0.85);