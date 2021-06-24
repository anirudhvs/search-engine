let siteData = require("../site_data");

(() => {
  let visited = {};
  let stack = [];
  for (let i = 0; i < siteData.length; i++) {
    if (visited[i] !== undefined) {
      continue;
    }
    stack.push(i);
    while(stack.length!==0){
      let top = stack.pop();
      if (visited[top] !== undefined) {
        continue;
      } 
      visited[top] = 1;
      for(var j =0; j<siteData[top].links.length; j++){
          stack.push(siteData[top].links[j]);
      }
    }
  }
})()
