var search = require("../../functions/animeAlerts/searchAnime");
const Discord = require("discord.js");
module.exports = {
  name: "findanime",
  description: "Find currently airing anime from MAL",
  category: "Anime",
  usage: "[anime title]",
  active: true,
  args: true,
  async execute(message, args) {
    const query = args.join(" ");
    let data = await search(query);
    if (!data) {
      return message.channel.send("no data found");
    }
    let {
      mal_id: id,
      url: url,
      image_url: image,
      title: title,
      synopsis: synopsis,
      episodes: episodes,
      score: score,
    } = data;
    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(title)
      .setURL(url)
      .setImage(image)
      .addFields(
        { name: "Synopsis", value: synopsis },
        { name: "Episodes", value: episodes, inline: true },
        { name: "Score", value: score, inline: true },
        { name: "ID", value: id, inline: true }
      );
    message.channel.send({ embed: embed });
  },
};
