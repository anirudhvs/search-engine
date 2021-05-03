const chalk = require("chalk");

class map {
  constructor() {
    this.stringsmap = {};
  }

  insert(string, url) {
    if (this.stringsmap[string]) {
      this.stringsmap[string].push(url);
      console.log(chalk.grey(url, "mapped to", string));
    } else {
      this.stringsmap[string] = [];
      this.stringsmap[string].push(url);
      console.log(chalk.magenta(url, "mapped to new", string));
    }
  }

  search(key) {
    if (this.stringsmap[key]) return this.stringsmap[key];
    else return [];
  }
}

mapHead = new map();
mapPtag = new map();

module.exports = {
  mapHead,
  mapPtag,
};
