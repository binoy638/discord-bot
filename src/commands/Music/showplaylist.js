const Commando = require("discord.js-commando");
const getplaylist = require("../../functions/music/getplaylist");
const cache = require("../../functions/cache");
const Discord = require("discord.js");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "showplaylist",
      aliases: ["spl"],
      group: "music",
      memberName: "showplaylist",
      description: "Show currently loaded spotify playlist.",
      args: [
        {
          key: "page",
          prompt: "Which page you want to see?(25 tracks per page)",
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
    const { member } = message;
    let data = cache.get(`Playlist-${member.id}`);
    if (!data) {
      return message.reply("You have no playlist loaded currently.");
    }

    // console.log(data.playlistInfo);
    // const page = args.page;
    // const index = page * 10;

    function pagination(arr, page, size) {
      const startIndex = page - 1;

      const newarr = arr.slice(size * startIndex, size * page);
      return newarr;
    }
    const totaltracks = data.tracks.length;
    const page = args.page;
    const tracks = pagination(data.tracks, page, 10);
    const maxpages = Math.ceil(totaltracks / 10);
    const Embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(data.playlistInfo.title)
      .setDescription(
        `Playing owner:\`${data.playlistInfo.owner}\`\nTotal tracks:\`${totaltracks}\``
      )
      .setThumbnail(data.playlistInfo.playlistimage);
    if (tracks.length === 0) {
      Embed.addField(
        "You have reach the end of the list.",
        `use ${prefix}showplaylist to go to the beginning.`
      );
    } else {
      tracks.map((item, i) =>
        Embed.addField(`${i + 1}. ${item.track}`, `${item.artists}`)
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
