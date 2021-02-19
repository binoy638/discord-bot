const Commando = require("discord.js-commando");
const cache = require("../../functions/cache");
const Discord = require("discord.js");
const find = require("../../functions/music/playlist/find");
const pagination = require("../../functions/utils/pagination");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "playlistshow",
      aliases: ["pls", "playlist_show", "showplaylist", "show"],
      group: "music",
      memberName: "playlistshow",
      description: "View your playlist.",
      args: [
        {
          key: "page",
          prompt: "Which page you want to see?(10 tracks per page)",
          type: "integer",
          min: 1,
          max: 10,
          default: 1,
        },
      ],
    });
  }
  async run(message, args) {
    const prefix = message.guild._commandPrefix;
    const { username } = message.member.user;
    const { id } = message.member.user;
    let playlist = cache.get(`Playlist-${id}`);
    if (!playlist) {
      playlist = await find(id);
      cache.set(`Playlist-${id}`, playlist);
    }

    if (!playlist) {
      return message.reply("You don't have a active playlist.");
    }

    const totaltracks = playlist.length;
    const page = args.page;
    const index = args.page - 1;
    const tracks = pagination(playlist, page, 10);
    const maxpages = Math.ceil(totaltracks / 10);

    const Embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`${username}'s Playlist`)
      .setDescription(`Total tracks:\`${totaltracks}\``);

    if (tracks.length === 0) {
      Embed.addField(
        "You have reach the end of the list.",
        `use ${prefix}showplaylist to go to the beginning.`
      );
    } else {
      tracks.map((item, i) =>
        Embed.addField(
          `${i + index * 10 + 1}. ${item.track}`,
          `${item.artists ? item.artists : "NA"}`
        )
      );
    }
    if (maxpages > page) {
      Embed.setFooter(
        `Use ${prefix}showplaylist ${page + 1} to view next tracks.`
      );
    }

    message.channel.send(Embed);
  }
};
