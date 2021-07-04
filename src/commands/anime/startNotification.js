const Discord = require("discord.js");
const getanime = require("../../utils/animeAlerts/getanime");
const Commando = require("discord.js-commando");
const { agenda } = require("../../configs/agenda");
const axios = require("axios");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "start",
      aliases: ["ani_start"],
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
    const { channel } = message;

    const anime = await getanime(id);
    if (!anime) {
      return message.channel.send(
        `\`Service not available for anime id:${id}\``
      );
    }
    const isExists = await agenda.jobs({
      name: "animeTimer",
      "data.guildID": channel.guild.id,
      "data.animeID": id,
    });

    if (isExists.length > 0)
      return message.reply(
        `Notification for \`${anime.title}\` is already activated on this guild.`
      );
    const {
      data: { image_url: animeImage },
    } = await axios.get(`https://api.jikan.moe/v3/anime/${id}`);

    const job = agenda.create("animeTimer", {
      guildID: channel.guild.id,
      channelID: channel.id,
      animeID: id,
      animeImage,
      animeTitle: anime.title,
    });

    job.repeatEvery(anime.Corn_Time, { timezone: "Asia/Kolkata" });

    job.save();
    const embed = new Discord.MessageEmbed()
      .setTitle("Anime Notifications")
      .setDescription(
        `\>>> \**Title\**: ${anime.title}\n\**Day\**: ${anime.IST_Day}\n\**Time\**: ${anime.IST}(IST)\n\**Status\**: ✅ \n`
      )
      .setImage(animeImage);
    message.channel.send(embed);
  }
};
