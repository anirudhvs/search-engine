const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

const trie = require("./trieCreater");
const scraper = require("./scraper");

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

scraper.bfs();

app.post("/search", (req, res) => {
  console.warn(req.body);
  head = trie.trieHead.search(req.body.word);
  ptag = trie.trieHead.search(req.body.word);

  console.log(trie.trieHead.search(req.body.word));
  var s;
  if (head.length) s = `Word is in headings in ${head.length} `;
  else s = "Word is not found in headings ";
  if (ptag.length) s += `and is in paragraph in ${ptag.length} `;
  else s += "and not found in paragraph";
  res.send(s);
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
