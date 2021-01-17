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
    replaceCronJob: function (key, channel_id, job) {
      cache[key].map((x) => {
        if (x[channel_id]) {
          x[channel_id] = job;
        }
      });
    },
    removeCronJob: function (key, channel_id) {
      console.log("before remove");
      console.log(cache[key]);
      var new_cache = cache[key].filter((x) => {
        //filter returns array thats why this is not working
        if (!x[channel_id]) {
          return x;
        }
      });
      cache[key] = new_cache;
      console.log("after remove");
      console.log(cache[key]);
    },
    addCronJob: function (key, channel_id, job) {
      let new_job = {};
      new_job[channel_id] = job;
      cache[key].push(new_job);
    },
    findCronJob: function (key, channel_id) {
      const result = cache[key].find((obj) => obj[channel_id]);
      return result[channel_id];
    },
  };
})();
