const { CACHE_TIME } = require("./config.js")();

class CacheObject {
  constructor(contents, name) {
    this.birth = Date.now();
    this.data = contents;
    this.invalidated = false;
    this.last_validate = 0;
    this.cache_time = CACHE_TIME;
    this.name = name;
  }
  get Expired() {
    return Date.now() - this.birth > this.cache_time;
  }
  invalidate() {
    this.invalidated = true;
  }
}

class CacheCollection {
  constructor() {
    this.collection = {};
  }
  add(name, content) {
    this.collection[name] = new CacheObject(content, name);
    this.collection[name].last_validate = Date.now();
    return this.collection[name];
  }
  remove(name) {
    delete this.collection[name];
  }
  find(name, callback) {
    // callback is the function needed to instead retreive new data
    if (this.collection[name] && !this.collection[name].Expired) {
      console.log(`Cache hit: ${name}`);
      return this.collection[name];
    } else {
      console.log(`No cache: ${name}`);
      return callback();
    }
  }
  get Age() {
    return (Date.now() - this.birth)/1000;
  }
}

module.exports = {
  CacheObject,
  CacheCollection
};
