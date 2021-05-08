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
