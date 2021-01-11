var cache = require("./cache");
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
    console.log("here");
    return true;
  } else {
    return false;
  }
};
