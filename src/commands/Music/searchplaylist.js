const Commando = require("discord.js-commando");
const getplaylist = require("../../functions/music/getplaylist");
const Discord = require("discord.js");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "search_playlist",
      group: "music",
      memberName: "search_playlist",
      description: "Search a spotify playlist.",
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
    let url = args.url;

    let slug = url.split("/").pop();

    let data = await getplaylist(slug);
    if (!data) {
      message.channel.send("Can't fetch playlist.");
    }
    const tracks = data.tracks;
    // console.log(data.playlistInfo);
    const Embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(data.playlistInfo.title)
      .setDescription(
        `Playing owner:\`${data.playlistInfo.owner}\`\nTotal tracks:\`${data.tracks.length}\``
      )
      .setThumbnail(data.playlistInfo.playlistimage);
    tracks.map((item, i) =>
      Embed.addField(`${i + 1}. ${item.track}`, `${item.artists}`)
    );
    message.channel.send(Embed);
  }
};
