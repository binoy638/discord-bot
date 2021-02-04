const job = require("../functions/JobManager");
const mongo = require("../mongo");
const animeAlertSchema = require("../schemas/animeAlertSchema");

module.exports = {
  name: "stop_anime_alert",
  description: "Stop anime alerts",
  usage: "<anime id>",
  args: true,
  active: true,
  args_limit: 1,

  async execute(message, args) {
    let channel_id = message.channel.id;
    let anime_id = args[0];

    const JobId = `Alerts-${channel_id}-${anime_id}`;

    const check = job.exists(JobId);

    if (check === true) {
      await mongo().then(async (mongoose) => {
        try {
          await animeAlertSchema.findOneAndDelete({
            _id: `${channel_id}-${anime_id}`,
          });

          job.delete(JobId);
          console.log(`${JobId} Deleted`);
          message.channel.send(
            `Ok,I won't send anime notification anymore for #${anime_id}.`
          );
        } catch (e) {
          console.log("not found");
        } finally {
          mongoose.connection.close();
        }
      });
    } else {
      return message.channel.send(
        `Anime notification not enabled for #${anime_id}`
      );
    }
  },
};
