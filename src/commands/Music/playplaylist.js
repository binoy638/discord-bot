const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const cache = require("../../functions/cache");
const play = require("../../functions/music/play");
module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "playplaylist",
      group: "music",
      memberName: "playplaylist",
      aliases: ["ppl"],
      description: "Play track from currently loaded spotify playlist.",
      args: [
        {
          key: "id",
          prompt: "Which track you want to play?",
          type: "integer",
          default: "1",
        },
      ],
    });
  }
  async run(message, args) {
    const { member } = message;
    const data = cache.get(`Playlist-${member.id}`);
    if (!data) {
      return message.reply("You have no playlist loaded currently.");
    }

    const id = args.id - 1;

    const tracks = data.tracks;
    const totaltracks = data.tracks.length;
    const title = data.playlistInfo.title;
    if (id > totaltracks) {
      return message.reply(
        `Track no \`${args.id}\` not found in playlist \`${title}\``
      );
    }
    const trackinfo = tracks[id];
    const query = `${trackinfo.artists} ${trackinfo.track}`;
    console.log(query);
    const { voice } = message.member;
    if (!voice.channelID) {
      message.reply("You must be in a voice channel");
      return;
    }

    const connection = await voice.channel.join();
    play(message.channel, connection, query);
  }
};
