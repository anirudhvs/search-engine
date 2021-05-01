const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

const trie = require("./trie");
const scraper = require("./scraper");

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

scraper.bfs();

app.post("/search/trie", (req, res) => {
  head = trie.trieHead.search(req.body.word);
  ptag = trie.triePtag.search(req.body.word);
  let union = [...new Set([...ptag, ...head])];
  res.send(union);
});

app.post("/search/map", (req, res) => {
  head = trie.trieHead.search(req.body.word);
  ptag = trie.triePtag.search(req.body.word);
  let union = [...new Set([...ptag, ...head])];
  res.send(union);
});

app.post("/words", (req, res) => {
  head = trie.trieHead.suggest(req.body.snip);
  ptag = trie.triePtag.suggest(req.body.snip);
  let union = [...new Set([...ptag, ...head])];
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
  res.sendFile(path.join(__dirname, "..", "site_data.json"));
});

app.listen(5000);
console.log("Server is listening on http://localhost:5000");
