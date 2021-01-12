var CronJobManager = require("cron-job-manager");
module.exports = (function () {
  var manager = new CronJobManager();
  return {
    add: function (key, time, taskfunction) {
      manager.add(key, time, taskfunction);
    },
    show: function () {
      console.log(manager);
    },
    update: function (key, time, taskfunction) {
      manager.update(key, time, taskfunction);
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
      return manager.deleteJob(key);
    },
  };
})();
