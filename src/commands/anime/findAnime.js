var search = require("../../functions/animeAlerts/searchAnime");
const Commando = require("discord.js-commando");
module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "find",
      group: "anime",
      memberName: "find",
      description: "Search currently airing anime.",
    });
  }
  async run(message, args) {
    const query = args;
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
  }
};
