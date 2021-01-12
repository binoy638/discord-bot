var cache = require("./cache");
var cron = require("cron");
module.exports = (channel_id) => {
  const CronJobsList = cache.get("Cron Jobs");
  let job = null;
  CronJobsList.map((obj) => {
    if (obj[channel_id]) {
      job = obj[channel_id];
    }
  });

  if (job) {
    job.stop();

    cache.removeCronJob("Cron Jobs", channel_id);

    return true;
  } else {
    return false;
  }
};
