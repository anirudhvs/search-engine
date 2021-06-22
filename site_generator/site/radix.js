const chalk = require("chalk");
class RadixNode {
  static nodeCount = 0;
  constructor(label, isWord = false) {
    this.label = label;
    this.children = {};
    this.url = [];
    this.id = RadixNode.nodeCount++;

    this.isWord = isWord;
  }

  addUrlAndMarkAsWord(url) {
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

  insert(word, url) {
    if (!/^[a-zA-Z]+$/.test(word)) return;
    if (word == null) {
      return;
    }
    word = word.toLowerCase();

    let currentNode = this.root;

    for (let i = 0; i < word.length; i++) {
      const currentCharacter = word[i];

      if (currentCharacter in currentNode.children) {
        const child = currentNode.children[currentCharacter];
        const commonPrefix = getCommonPrefix(child.label, word.substr(i));

        if (child.label === word.substr(i)) {
          child.addUrlAndMarkAsWord(url);

          console.log(chalk.grey("'" + word + "' inserted into radix"));
          return;
        }

        if (
          commonPrefix.length < child.label.length &&
          commonPrefix.length === word.substr(i).length
        ) {
          const newNode = new RadixNode(word.substr(i));
          const childKey = child.label[commonPrefix.length];
          newNode.addUrlAndMarkAsWord(url);
          newNode.children[childKey] = child;
          newNode.children[childKey].label = child.label.substr(commonPrefix.length);
          currentNode.children[currentCharacter] = newNode;

          this.nodes.push(newNode);
          console.log(chalk.grey("'" + word + "' inserted into radix"));
          return;
        }

        if (
          commonPrefix.length < child.label.length &&
          commonPrefix.length < word.substr(i).length
        ) {
          const inbetweenNode = new RadixNode(commonPrefix);

          const leftChild = child;
          const leftKey= leftChild.label[commonPrefix.length];
          inbetweenNode.children[leftKey] = leftChild;
          inbetweenNode.children[leftKey].label = leftChild.label.substr(commonPrefix.length);
          currentNode.children[currentCharacter] = inbetweenNode;

          const rightChild = new RadixNode(word.substr(i + commonPrefix.length));
          const rightKey = word.substr(i)[commonPrefix.length];
          inbetweenNode.children[rightKey] = rightChild;
          inbetweenNode.children[rightKey].addUrlAndMarkAsWord(url);

          this.nodes.push(inbetweenNode);
          this.nodes.push(rightChild);
          console.log(chalk.grey("'" + word + "' inserted into radix"));
          return;
        }

        i += child.label.length - 1;
        currentNode = child;
      } else {
        const newNode = new RadixNode(word.substr(i));
        newNode.addUrlAndMarkAsWord(url);
        currentNode.children[currentCharacter] = newNode;

        this.nodes.push(newNode);
        console.log(chalk.grey("'" + word + "' inserted into radix"));
        return;
      }
    }
  }

  search(word) {
    if (word == null) {
      return [];
    }
    word = word.toLowerCase();
    let currentNode = this.root;

    for (var i = 0; i < word.length;) {
      if (currentNode.children[word[i]] == null) {
        return [];
      }
      currentNode = currentNode.children[word[i]];
      i += currentNode.label.length
      if (i > word.length) {
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

    let key = '';
    let currentNode = this.root;
    for (let i = 0; i < prefix.length; i++) {
      const character = prefix[i];

      if (character in currentNode.children) {
        const edgeLabel = currentNode.children[character].edgeLabel;
        const commonPrefix = getCommonPrefix(edgeLabel, prefix.substr(i));

        if (commonPrefix.length !== edgeLabel.length && commonPrefix.length !== prefix.substr(i).length) {
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
        dfs(startingNode.children[character], key.concat(startingNode.children[character].edgeLabel));
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
