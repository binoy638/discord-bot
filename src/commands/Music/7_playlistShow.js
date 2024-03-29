const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const { find } = require("../../utils/music/playlist/helper");
const pagination = require("../../utils/misc/pagination");
const { ErrorEmbed } = require("../../utils/embed");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "playlistshow",
      aliases: ["pls", "playlist_show", "showplaylist", "show"],
      group: "music",
      memberName: "7playlistshow",
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

    const playlist = await find(id);

    if (!playlist) {
      return ErrorEmbed(
        `You don't have any playlist currently.\nUse \`${prefix}playlistadd\` to create a playlist.`,
        message.channel
      );
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
