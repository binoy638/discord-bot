module.exports = (function () {
  var cache = {};
  return {
    get: function (key) {
      return cache[key];
    },
    set: function (key, val) {
      cache[key] = val;
    },
    clear: function () {
      cache = {};
    },
    show: function () {
      console.log(cache);
    },
    delete: function (key) {
      delete cache[key];
    },
    empty: function (key) {
      cache[key] = [];
    },
  };
})();
