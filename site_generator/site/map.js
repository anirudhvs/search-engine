const chalk = require("chalk");

class map {
  constructor() {
    this.stringsmap = {};
  }

  insert(string, url) {
    if (this.stringsmap[string]) {
      this.stringsmap[string].push(url);
      console.log(chalk.grey(url, "maped to", string));
    } else {
      this.stringsmap[string] = [];
      this.stringsmap[string].push(url);
      console.log(chalk.magenta(url, "maped to new", string));
    }
  }

  search(key) {
    if (stringsmap[string]) return stringsmap[string];
    else return [];
  }
}

mapHead = new map();
mapPtag = new map();

module.exports = {
  mapHead,
  mapPtag,
};
