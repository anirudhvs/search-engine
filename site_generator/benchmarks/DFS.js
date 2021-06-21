let siteData = require("../site_data");

const dfs = (i, visited) => {
  if (visited[siteData[i].site_url] !== undefined) return;
  visited[siteData[i].site_url] = 1;
  for (let j = 0; j < siteData[i].link_urls.length; j++) {
    dfs(siteData[i].links[j], visited);
  }
}

const startDFS = () => {
  let visited = {};
  for (let i = 0; i < siteData.length; i++) {
    if (visited[siteData[i].site_url] !== undefined) {
      continue;
    }
    dfs(i, visited);
  }
};

startDFS();
