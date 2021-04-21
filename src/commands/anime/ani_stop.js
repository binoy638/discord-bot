const job = require("../../functions/JobManager");
const mongo = require("../../mongo");
const animeAlertSchema = require("../../models/anime");
const Commando = require("discord.js-commando");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "ani_stop",
      group: "anime",
      memberName: "ani_stop",
      description: "Stop new episode release notification of an anime.",
      args: [
        {
          key: "animeID",
          prompt: "Please enter the ID of the anime.",
          type: "integer",
        },
      ],
    });
  }
  async run(message, args) {
    let channel_id = message.channel.id;
    let anime_id = args.animeID;

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
            `\`Anime notification disabled for anime ID: ${anime_id}.\``
          );
        } catch (e) {
          console.log("not found");
        } finally {
          mongoose.connection.close();
        }
      });
    } else {
      return message.channel.send(
        `\`Anime notification not enabled for anime ID:${anime_id}\``
      );
    }
  }
};
