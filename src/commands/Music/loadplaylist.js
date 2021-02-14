const Commando = require("discord.js-commando");
const getplaylist = require("../../functions/music/getplaylist");
const cache = require("../../functions/cache");
const Discord = require("discord.js");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "loadplaylist",
      group: "music",
      memberName: "loadplaylist",
      aliases: ["lpl", "loadlist"],
      description: "load a spotify playlist.",
      args: [
        {
          key: "url",
          prompt: "Please provide a spotify playlist url or slug.",
          type: "string",
        },
      ],
    });
  }
  async run(message, args) {
    const { member } = message;
    let url = args.url;

    let slug = url.split("/").pop();

    let data = await getplaylist(slug);
    if (!data) {
      message.channel.send("Can't fetch playlist.");
    }
    // const tracks = data.tracks;
    // console.log(data.playlistInfo);
    const Embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(data.playlistInfo.title)
      .setDescription(
        `Owner:\`${data.playlistInfo.owner}\`\nTracks:\`${data.tracks.length}\``
      )
      // .setThumbnail(data.playlistInfo.playlistimage)
      .setFooter("Playlist successfully loaded");
    cache.set(`Playlist-${member.id}`, data);
    message.channel.send(Embed);
  }
};
