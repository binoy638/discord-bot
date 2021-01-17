var cache = require("node-cache");

module.exports = (function () {
  this.storage = new cache();
  // this.storage.on("set", function (key, value) {
  //   console.log(`key:${key} value:${value}`);
  // });
  // this.storage.on("expired", function (key, value) {
  //   console.log(`${key} expired`);
  // });
  this.storage.on("flush", function () {
    console.log("Cache Flushed");
  });
  return this.storage;
})();
