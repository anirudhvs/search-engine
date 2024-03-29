const chalk = require("chalk");

class TrieNode {
  static nodeCount = 0;
  constructor(char) {
    this.children = [];
    for (var i = 0; i < 26; i++) {
      this.children[i] = null;
    }
    this.isEndWord = false;
    this.char = char;
    this.id = TrieNode.nodeCount++;
    this.url = [];
  }
  markAsLeaf(url) {
    this.isEndWord = true;
    this.url.push(url);
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode("");
    this.nodes = [this.root];
  }

  getIndex(t) {
    return t.charCodeAt(0) - "a".charCodeAt(0);
  }
  insert(key, url) {
    if (!/^[a-zA-Z]+$/.test(key)) return;
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
        this.nodes.push(currentNode.children[index]);
      }
      currentNode = currentNode.children[index];
    }
    currentNode.markAsLeaf(url);
    // console.log(chalk.grey("'" + key + "' inserted into trie"));
  }
  search(key) {
    if (key == null) {
      return [];
    }
    key = key.toLowerCase();
    let currentNode = this.root;
    let index = 0;

    for (var level = 0; level < key.length; level++) {
      index = this.getIndex(key[level]);
      if (currentNode.children[index] == null) {
        return [];
      }
      currentNode = currentNode.children[index];
    }
    if (currentNode != null && currentNode.isEndWord) {
      return currentNode.url;
    }
    return [];
  }
  suggest(key) {
    if (key == null) {
      return;
    }
    if (!/^[a-zA-Z]+$/.test(key)) return [];
    key = key.toLowerCase();
    let currentNode = this.root;
    let found = true;
    let index = 0;

    for (let level = 0; level < key.length; level++) {
      index = this.getIndex(key[level]);

      if (currentNode.children[index] == null) {
        found = false;
        break;
      }
      currentNode = currentNode.children[index];
    }

    if (!found) {
      return [];
    }
    const suggestions = [];
    let tracker = "";

    function recurse(node) {
      if (node) {
        tracker += node.char;

        if (node.isEndWord) {
          let temp = key + tracker;
          suggestions.push(temp);
        }

        node.children.forEach((child) => recurse(child));
        tracker = tracker.slice(0, -1);
      }
    }

    currentNode.children.forEach((child) => recurse(child));
    if (currentNode.isEndWord) suggestions.push(key);
    return suggestions;
  }
}

trieHead = new Trie();
triePtag = new Trie();

module.exports = {
  triePtag,
  trieHead,
};
