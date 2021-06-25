const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");
const pagination = require("../../functions/utils/pagination");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "queue",
      aliases: ["showqueue", "qu", "showq"],
      group: "music",
      memberName: "queue",
      description: "View currently queued tracks.",
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
    const musicPlayer = musicPlayerInstance(message.channel);
    let playlist = musicPlayer.showQueue();

    if (playlist.length === 0) {
      return message.reply("No tracks in queue.");
    }

    const totaltracks = playlist.length;
    const page = args.page;
    const index = args.page - 1;
    const tracks = pagination(playlist, page, 10);
    const maxpages = Math.ceil(totaltracks / 10);

    const Embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Queued Tracks`)
      .setDescription(`Total tracks:\`${totaltracks}\``);

    if (tracks.length === 0) {
      Embed.addField(
        "You have reach the end of the list.",
        `use ${prefix}queue to go to the beginning.`
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
      Embed.setFooter(`Use ${prefix}queue ${page + 1} to view next tracks.`);
    }

    message.channel.send(Embed);
  }
};
