var CronJob = require("cron").CronJob;
const NineGag = require("./ninegag");
const sendgag = require("./sendgag");
const cache = require("./cache");
const getcronjob = require("./getcronjob");
module.exports = async (section, interval, channel) => {
  const nineGagObject = new NineGag(section);
  const JobExist = getcronjob(channel.id);
  var job = new CronJob(
    `*/${interval} * * * * *`,
    async function () {
      let resp = await nineGagObject.getRandomPost(5);
      sendgag(resp, channel);
    }
    // ,
    // null,
    // true
  );

  job.start();
  if (JobExist === true) {
    cache.replaceCronJob("Cron Jobs", channel.id, job);
  } else {
    var new_job = {};
    new_job[channel.id] = job;

    var cron_job_list = cache.get("Cron Jobs");
    cron_job_list.push(new_job);
  }
};
