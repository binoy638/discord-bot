const Discord = require("discord.js");
const mongo = require("../../configs/mongo");
const animeAlertSchema = require("../../models/anime");
const getanime = require("../../functions/animeAlerts/getanime");
const job = require("../../functions/animeAlerts/setJobs");
const sendAlert = require("../../functions/animeAlerts/sendAlert");
const Commando = require("discord.js-commando");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "ani_start",
      group: "anime",
      memberName: "ani_start",
      description: "Start new episode release notication of an anime.",
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
    let id = args.animeID;
    let channel_id = message.channel.id;

    const anime = await getanime(id);
    if (!anime) {
      return message.channel.send(
        `\`Service not available for anime id:${id}\``
      );
    }

    anime["anime_id"] = id;
    let { Airing: Airing, Corn_Time: Cron_Time, title: title } = anime;
    await mongo().then(async (mongoose) => {
      try {
        const data = await animeAlertSchema.findOne({
          _id: `${channel_id}-${id}`,
        });
        if (data) {
          return message.channel.send(
            `Anime Alerts for \`${title}\` already activated in this channel`
          );
        } else {
          console.log("tring to insert");
          await animeAlertSchema.create({
            _id: `${channel_id}-${id}`,
            channelId: channel_id,
            guild: message.channel.guild.id,
            anime_id: id,
            cron_time: Cron_Time,
            anime_title: title,
          });
          job(id, title, Cron_Time, message.channel);
          message.channel.send(
            `Anime Alerts for \`${title}\` has been activate on this channel.`
          );
          sendAlert(anime, message.channel, true);
        }
      } catch (e) {
        console.log(e);
      } finally {
        mongoose.connection.close();
      }
    });
  }
};
