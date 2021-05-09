const fs = require('fs');

const visualize = (nodes, fileName) => {
  let nodeList = [], edgeList = [];
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    nodeList.push({
      id: node.id,
      label: node.label ?? node.char
    });
    if (Array.isArray(node.children)) {
      for (let j = 0; j < node.children.length; j++) {
        // console.log(node.children[j]);
        if (node.children[j] != null) {
          edgeList.push({
            from: node.id,
            to: node.children[j].id,
          });
        }
      }
    } else {
      for (const [label, child] of Object.entries(node.children)) {
        edgeList.push({
          from: node.id,
          to: child.id,
          label: label
        });
      }
    }
    fs.writeFileSync(`./${fileName}.json`, JSON.stringify({
      nodeList: nodeList,
      edgeList: edgeList
    }));
  }
}

module.exports = {
  visualize
}