const trie = require("./trie");
const radix = require("./radix");
const map = require("./map");

function Head(data, url) {
  data = data.split(/[^A-Za-z]/);
  Object.values(data).forEach((datum) => {
    trie.trieHead.insert(datum, url);
    radix.radixTreeHead.insert(datum, url);
    map.mapHead.insert(datum, url);
  });
}

function Ptag(data, url) {
  data = data.split(/[^A-Za-z]/);
  Object.values(data).forEach((datum) => {
    trie.triePtag.insert(datum, url);
    radix.radixTreePtag.insert(datum, url);
    map.mapPtag.insert(datum, url);
  });
}

module.exports = {
  Head,
  Ptag,
};
