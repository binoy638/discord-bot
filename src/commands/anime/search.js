const axios = require("axios");
const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const { ErrorEmbed } = require("../../utils/embed");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "search",
      aliases: ["ani_search"],
      group: "anime",
      memberName: "ani_search",
      description: "Search currently airing anime.",
      args: [
        {
          key: "query",
          prompt: "Which anime you want to search?",
          type: "string",
        },
      ],
    });
  }
  async run(message, args) {
    const query = args.query;
    try {
      const { data } = await axios.get(
        `https://api.jikan.moe/v3/search/anime?q=${query}&status=airing`
      );
      const anime = data.results[0];
      if (!anime) {
        return ErrorEmbed(
          "Something went wrong,please try again later.",
          message.channel
        );
      }

      const {
        mal_id: id,
        url: url,
        image_url: image,
        title: title,
        synopsis: synopsis,
        episodes: episodes,
        score: score,
      } = anime;
      const embed = new Discord.MessageEmbed()
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
    } catch (error) {
      ErrorEmbed(
        "Something went wrong,please try again later.",
        message.channel
      );
    }
  }
};
