var job = require("../JobManager");
const findep = require("./findepisode");
const sendAlert = require("./sendAlert");
var myprefix = require("../../bot");
module.exports = async (id, title, cron_time, channel) => {
  let prefix = myprefix.prefix || "#";
  job_id = `Alerts-${channel.id}-${id}`;
  job.add(
    job_id,
    cron_time,
    async () => {
      let episode = await findep(id);

      if (!episode) {
        return channel.send(
          `${title}'s new episode got delayed.\nUse \`${prefix}getep ${id}\` to get latest episode manually.`
        );
      }

      sendAlert(episode, channel, false);
    },
    {
      start: false,
      timeZone: "America/Los_Angeles",
    }
  );
  job.start(job_id);
  console.log(`job-${job_id} started`);
};
