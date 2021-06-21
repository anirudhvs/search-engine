let siteData = require("../site_data");

const bfs = (i, visited) => {
  let queue = [i];
  let queueBeg = 0;
  while (queueBeg < queue.length) {
    let size = queue.length - queueBeg;
    while (size--) {
      let front = queue[queueBeg];
      queueBeg++;
      if (visited[front] !== undefined) {
        continue;
      }
      visited[front] = 1;
      for (let j = 0; j < siteData[front].links.length; j++) {
        if (visited[siteData[front].links[j]] === undefined) {
          queue.push(siteData[front].links[j]);
        }
      }
    }
  }
};
const bfsStart = () => {
  let visited = {}
  for (let i = 0; i < siteData.length; i++) {
    if (visited[i] !== undefined) {
      continue;
    }
    bfs(i, visited);
  }
}
bfsStart()
