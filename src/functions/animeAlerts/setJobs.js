var job = require("../JobManager");
const findep = require("./findepisode");
const sendAlert = require("./sendAlert");

module.exports = async (id, title, cron_time, channel) => {
  job_id = `Alerts-${channel.id}-${id}`;
  job.add(
    job_id,
    cron_time,
    async () => {
      let episode = await findep(id);

      if (!episode) {
        return channel.send(
          `${title}'s new episode got delayed.\nUse \`ani_ep ${id}\` to get the last released episode.`
        );
      }
      episode["anime_id"] = id;
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
