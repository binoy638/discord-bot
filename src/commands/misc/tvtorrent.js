const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const { ErrorEmbed } = require("../../utils/embed");
const { baseUrl, dashboardUrl } = require("../../configs/api");
const axios = require("axios");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "tvtorrent",
      group: "misc",
      memberName: "tvtorrent",
      description: "Search tv torrent.",
      args: [
        {
          key: "query",
          prompt: "Enter search query.",
          type: "string",
        },
      ],
    });
  }
  async run(message, args) {
    const { channel } = message;

    const query = args.query;

    try {
      const { data } = await axios.get(`${baseUrl}/search/tvshows?q=${query}`);
      if (!data || data?.results.length === 0)
        return ErrorEmbed(`No results found for ${query}.`, channel);
      const torrent = data.results;
      const embed = new Discord.MessageEmbed().setTitle(
        `Search results for ${query}`
      );
      torrent.map((item) => {
        embed.addFields(
          { name: "\u200b", value: item.title.substring(0, 80) },
          { name: "Size", value: item.size, inline: true },
          { name: "Seeds", value: item.seed, inline: true },
          {
            name: "Download",
            value: `[Link](${dashboardUrl}/${item.slug})`,
            inline: true,
          }
        );
      });

      channel.send(embed);
    } catch (error) {
      console.error(error);
      ErrorEmbed("Something went wrong, please try again later.", channel);
    }
  }
};
