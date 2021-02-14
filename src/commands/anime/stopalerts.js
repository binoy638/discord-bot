const job = require("../../functions/JobManager");
const mongo = require("../../mongo");
const animeAlertSchema = require("../../schemas/animeAlertSchema");
const Commando = require("discord.js-commando");
module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "stop_anime_alerts",
      group: "anime",
      memberName: "stop_anime_alerts",
      description: "Stop anime alerts.",
    });
  }
  async run(message, args) {
    let channel_id = message.channel.id;
    let anime_id = args;

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
  }
};
