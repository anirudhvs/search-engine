const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

const trie = require("./trie");
const radix = require("./radix");
const map = require("./map");
const scraper = require("./scraper");
const pageRank = require("./pagerank");
const visualizer = require("./visualizer");
const ranking = pageRank(100, 0.85);
// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

scraper
  .bfs()
  .then(() => {
    visualizer.visualize(radix.radixTreeHead.nodes, "radix_tree_data");
  })
  .then(() => {
    visualizer.visualize(trie.trieHead.nodes, "trie_data");
  });

function sortByRank(site1, site2) {
  if (ranking[site1] < ranking[site2]) {
    return 1;
  } else if (ranking[site1] > ranking[site2]) {
    return -1;
  } else {
    return 0;
  }
}

app.post("/search/trie", (req, res) => {
  head = trie.trieHead.search(req.body.word);
  ptag = trie.triePtag.search(req.body.word);
  let union = [...new Set([...ptag, ...head])];
  union.sort(sortByRank);
  res.send(union);
});

app.post("/search/radix", (req, res) => {
  head = radix.radixTreeHead.search(req.body.word);
  ptag = radix.radixTreePtag.search(req.body.word);
  let union = [...new Set([...ptag, ...head])];
  union.sort(sortByRank);
  res.send(union);
});

app.post("/search/map", (req, res) => {
  head = map.mapHead.search(req.body.word);
  ptag = map.mapPtag.search(req.body.word);
  let union = [...new Set([...ptag, ...head])];
  union.sort(sortByRank);
  res.send(union);
});

app.post("/words", (req, res) => {
  head = trie.trieHead.suggest(req.body.snip);
  ptag = trie.triePtag.suggest(req.body.snip);
  let union = [...new Set([...ptag, ...head])];
  union.sort(sortByRank);
  res.send(union);
});

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(express.static(path.join(__dirname, "pages")));

app.get("/graph", (_, res) => {
  res.sendFile(path.join(__dirname, "graph.html"));
});

app.get("/data", (_, res) => {
  res.setHeader("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, "site_rank_data.json"));
});

app.get("/radix_tree_data", (_, res) => {
  res.setHeader("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, "radix_tree_data.json"));
});

app.get("/trie_data", (_, res) => {
  res.setHeader("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, "trie_data.json"));
});

app.get("/visualization", (_, res) => {
  res.sendFile(path.join(__dirname, "visualization.html"));
});

app.listen(5000);
console.log("Server is listening on http://localhost:5000");
