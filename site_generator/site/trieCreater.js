const chalk = require("chalk");

class TrieNode {
  constructor(char) {
    this.children = [];
    for (var i = 0; i < 26; i++) {
      this.children[i] = null;
    }
    this.isEndWord = false;
    this.char = char;
    this.url = [];
  }
  markAsLeaf(url) {
    this.isEndWord = true;
    this.url.push(url);
  }
  unMarkAsLeaf() {
    this.isEndWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode("");
  }

  getIndex(t) {
    return t.charCodeAt(0) - "a".charCodeAt(0);
  }
  insert(key, url) {
    if (key == null) {
      return;
    }
    key = key.toLowerCase();
    let currentNode = this.root;
    let index = 0;
    for (let level = 0; level < key.length; level++) {
      index = this.getIndex(key[level]);

      if (currentNode.children[index] == null) {
        currentNode.children[index] = new TrieNode(key[level]);
      }
      currentNode = currentNode.children[index];
    }
    currentNode.markAsLeaf(url);
    console.log(chalk.grey("'" + key + "' inserted"));
  }
  search(key) {
    if (key == null) {
      return false;
    }
    key = key.toLowerCase();
    let currentNode = this.root;
    let index = 0;

    for (var level = 0; level < key.length; level++) {
      index = this.getIndex(key[level]);
      if (currentNode.children[index] == null) {
        return false;
      }
      currentNode = currentNode.children[index];
    }
    if (currentNode != null && currentNode.isEndWord) {
      return currentNode.url;
    }
    return [];
  }
}

trieHead = new Trie();
triePtag = new Trie();

function Head(data, url) {
  data = data.split(" ");
  Object.values(data).forEach((datum) => {
    trieHead.insert(datum, url);
  });
}

function Ptag(data, url) {
  data = data.split(" ");
  Object.values(data).forEach((datum) => {
    triePtag.insert(datum, url);
  });
}

module.exports = {
  Head,
  Ptag,
  triePtag,
  trieHead,
};
