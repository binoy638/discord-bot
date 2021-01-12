var CronJob = require("cron").CronJob;
const NineGag = require("./ninegag");
const sendgag = require("./sendgag");
const cache = require("./cache");
const getcronjob = require("./getcronjob");
module.exports = async (section, interval, channel) => {
  const nineGagObject = new NineGag(section);
  const JobExist = getcronjob(channel.id);
  var job = new CronJob(
    `0 */${interval} * * * *`,
    async function () {
      let resp = await nineGagObject.getRandomPost(5);
      sendgag(resp, channel);
    },
    null,
    true
  );

  // job.start();
  if (JobExist === true) {
    console.log("Existing job found");
    cache.addCronJob("Cron Jobs", channel.id, job);
    cache.findCronJob("Cron Jobs", channel.id).start();

    // current_job.start();
  } else {
    // console.log("No Existing job found");
    cache.addCronJob("Cron Jobs", channel.id, job);
    // let current1_job = cache.get("Cron Jobs")[0][channel.id];
    // cache.show();
    // console.log("before running find cron");
    cache.findCronJob("Cron Jobs", channel.id).start();
    // current_job.start();
  }
};
