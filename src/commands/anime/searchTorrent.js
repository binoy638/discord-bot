const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const { ErrorEmbed } = require("../../utils/embed");
const axios = require("axios");
const { baseUrl, dashboardUrl } = require("../../configs/api");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "animetorrent",
      aliases: ["ani_torrent"],
      group: "anime",
      memberName: "animetorrent",
      description: "Search anime torrent.",
      args: [
        {
          key: "query",
          prompt: "Which anime you want to search?",
          type: "string",
        },
      ],
    });
  }
  async run(message, args, fromButton = false) {
    const prefix = message.guild._commandPrefix || "!";
    const { channel } = message;
    const query = args.query;

    try {
      const { data } = await axios.get(`${baseUrl}/search/anime?q=${query}`);
      if (!data || data?.results.length === 0)
        return ErrorEmbed(`No results found for ${query}.`, channel);
      const animes = data.results;
      const embed = new Discord.MessageEmbed().setTitle(
        `Search results for ${query}`
      );
      animes.slice(0, 5).map((anime) => {
        embed.addFields(
          { name: "\u200b", value: anime.title.substring(0, 80) },
          { name: "Size", value: anime.size, inline: true },
          { name: "Seeds", value: anime.seed, inline: true },
          {
            name: "Download",
            value: `[Link](${dashboardUrl}/download/${anime.slug})`,
            inline: true,
          }
        );
      });
      if (fromButton)
        embed.setDescription(
          `For custom search use \`${prefix}animetorrent [query]\``
        );
      channel.send(embed);
    } catch (error) {
      console.error(error);
      ErrorEmbed("Something went wrong, please try again later.", channel);
    }
  }
};
