const Commando = require("discord.js-commando");
const { ErrorEmbed, animeEmbed } = require("../../utils/embed");
const search = require("../../utils/anime/search");
const searchNavButtons = require("../../buttons/searchNavButtons");
const { CacheSetex } = require("../../utils/cache");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "anime",
      aliases: ["ani_search", "search"],
      group: "anime",
      memberName: "ani_search",
      description: "Search anime in myanimelist.",
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

    const searchResult = await search(query);

    const anime = searchResult[0];

    if (!anime)
      return ErrorEmbed(
        "Something went wrong,please try again later.",
        message.channel
      );

    const buttons = searchNavButtons(anime.airing);
    const msg = await message.channel.send({
      embed: animeEmbed(anime, 0),
      components: buttons,
    });
    msg.delete({ timeout: 1800000 });
    CacheSetex(msg.id, 1800, searchResult);
  }
};
