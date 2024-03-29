var CronJobManager = require("cron-job-manager");
module.exports = (function () {
  var manager = new CronJobManager();
  return {
    add: function (key, time, taskfunction, options) {
      options = options || {
        start: false,
        timeZone: "Asia/Kolkata",
      };
      manager.add(key, time, taskfunction, options);
    },
    show: function () {
      console.log(manager);
    },
    update: function (key, time, taskfunction) {
      manager.update(key, time, taskfunction, {
        start: false,
        timeZone: "Asia/Kolkata",
      });
    },
    start: function (key) {
      manager.start(key);
    },
    stop: function (key) {
      manager.stop(key);
    },
    exists: function (key) {
      return manager.exists(key);
    },
    delete: function (key) {
      console.log(`Deleting job ${key}`);
      manager.deleteJob(key);
    },
  };
})();
