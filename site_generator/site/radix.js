const chalk = require("chalk");
var j = 0;
class RadixNode {
  static nodeCount = 0;
  constructor(edgeLabel, isWord = false) {
    this.edgeLabel = edgeLabel;
    this.children = {};
    this.url = [];
    this.id = RadixNode.nodeCount++;

    this.isWord = isWord;
  }

  markAsLeaf(url) {
    this.isWord = true;
    this.url.push(url);
  }
}

class RadixTree {
  constructor() {
    this.root = new RadixNode("");
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

    for (let i = 0; i < key.length; i++) {
      const currentCharacter = key[i];

      if (currentCharacter in currentNode.children) {
        const edgeLabel = currentNode.children[currentCharacter].edgeLabel;
        const commonPrefix = getCommonPrefix(edgeLabel, key.substr(i));
        if (edgeLabel === key.substr(i)) {
          currentNode.children[currentCharacter].markAsLeaf(url);
          console.log(chalk.grey("'" + key + "' inserted into radix"));
          return;
        }

        if (
          commonPrefix.length < edgeLabel.length &&
          commonPrefix.length === key.substr(i).length
        ) {
          const newNode = new RadixNode(key.substr(i));
          this.nodes.push(newNode);
          newNode.markAsLeaf(url);
          console.log(chalk.grey("'" + key + "' inserted into radix"));
          newNode.children[edgeLabel[commonPrefix.length]] =
            currentNode.children[currentCharacter];
          newNode.children[
            edgeLabel[commonPrefix.length]
          ].edgeLabel = edgeLabel.substr(commonPrefix.length);
          currentNode.children[currentCharacter] = newNode;
          return;
        }

        if (
          commonPrefix.length < edgeLabel.length &&
          commonPrefix.length < key.substr(i).length
        ) {
          const inbetweenNode = new RadixNode(commonPrefix);
          this.nodes.push(inbetweenNode);
          inbetweenNode.children[edgeLabel[commonPrefix.length]] =
            currentNode.children[currentCharacter];
          inbetweenNode.children[
            edgeLabel[commonPrefix.length]
          ].edgeLabel = edgeLabel.substr(commonPrefix.length);
          currentNode.children[currentCharacter] = inbetweenNode;
          inbetweenNode.children[
            key.substr(i)[commonPrefix.length]
          ] = new RadixNode(key.substr(i + commonPrefix.length));
          this.nodes.push(inbetweenNode.children[
            key.substr(i)[commonPrefix.length]
          ]);
          inbetweenNode.children[key.substr(i)[commonPrefix.length]].markAsLeaf(
            url
          );
          console.log(chalk.grey("'" + key + "' inserted into radix"));
          return;
        }

        i += edgeLabel.length - 1;
        currentNode = currentNode.children[currentCharacter];
      } else {
        const newNode = new RadixNode(key.substr(i));
        this.nodes.push(newNode);
        newNode.markAsLeaf(url);
        console.log(chalk.grey("'" + key + "' inserted into radix"));
        currentNode.children[currentCharacter] = newNode;
        return;
      }
    }
  }

  search(key) {
    if (key == null) {
      return [];
    }
    key = key.toLowerCase();
    let currentNode = this.root;

    for (var level = 0; level < key.length;) {
      if (currentNode.children[key[level]] == null) {
        return [];
      }
      currentNode = currentNode.children[key[level]];
      level += currentNode.edgeLabel.length
      if (level > key.length) {
        return [];
      }
    }
    if (currentNode != null) {
      return currentNode.url;
    }
    return [];
  }

  suggest(prefix) {
    prefix = prefix.toLowerCase();

    let key = "";
    let currentNode = this.root;
    for (let i = 0; i < prefix.length; i++) {
      const character = prefix[i];

      if (character in currentNode.children) {
        const edgeLabel = currentNode.children[character].edgeLabel;
        const commonPrefix = getCommonPrefix(edgeLabel, prefix.substr(i));

        if (
          commonPrefix.length !== edgeLabel.length &&
          commonPrefix.length !== prefix.substr(i).length
        ) {
          return [];
        }

        key = key.concat(currentNode.children[character].edgeLabel);
        i += currentNode.children[character].edgeLabel.length - 1;
        currentNode = currentNode.children[character];
      } else {
        return [];
      }
    }

    let keys = [];
    function dfs(startingNode, key) {
      if (startingNode.isWord) {
        keys.push(key);
      }

      if (Object.keys(startingNode.children).length === 0) {
        return;
      }

      for (const character of Object.keys(startingNode.children)) {
        dfs(
          startingNode.children[character],
          key.concat(startingNode.children[character].edgeLabel)
        );
      }
    }

    dfs(currentNode, key);

    return keys.sort();
  }
}

function getCommonPrefix(a, b) {
  let commonPrefix = "";
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      return commonPrefix;
    }

    commonPrefix += a[i];
  }

  return commonPrefix;
}

radixTreeHead = new RadixTree();
radixTreePtag = new RadixTree();

module.exports = {
  radixTreePtag,
  radixTreeHead,
};
