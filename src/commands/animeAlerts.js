const Discord = require("discord.js");
const mongo = require("../mongo");
const animeAlertSchema = require("../schemas/animeAlertSchema");
const getanime = require("../functions/animeAlerts/getanime");
const job = require("../functions/animeAlerts/setJobs");
const sendAlert = require("../functions/animeAlerts/sendAlert");
module.exports = {
  name: "start_anime_alert",
  description: "Get notified when new episode is out.",
  usage: "<anime id>",
  args: true,
  active: true,
  args_limit: 1,

  async execute(message, args) {
    let id = args[0];
    let channel_id = message.channel.id;

    const anime = await getanime(id);
    if (!anime) {
      return message.channel.send(
        `Anime Alerts is not available for anime id:${id}`
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
  },
};
