const ytdl = require("discord-ytdl-core");
const search = require("../../functions/music/search");
const statusMsg = require("../../functions/music/statusMsg");
const cache = require("../../functions/cache");

const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "play",
      group: "music",
      aliases: ["p", "song", "music"],
      memberName: "1play",
      description: "Play a song.",
      args: [
        {
          key: "query",
          prompt: "What do you want me to play?",
          type: "string",
        },
      ],
    });
  }
  async run(message, args) {
    const query = args.query;
    let track = cache.get(`SongQuery:${query}`);
    if (!track) {
      const result = await search(query);
      if (result) {
        let info = await ytdl.getBasicInfo(result.link);

        const song = info.videoDetails.media.song;
        const artist = info.videoDetails.media.artist;

        if (song && artist) {
          result["song"] = song;
          result["artist"] = artist;
        }
        track = {
          track: result.song ? result.song : result.title,
          artists: result.artist ? result.artist : "",
          playerInfo: {
            link: result.link,
            title: result.title,
            image: result.image,
          },
        };
      }

      cache.set(`SongQuery:${query}`, track);
    }

    if (!track) {
      message.channel.send("No results found");
    }
    if (!ytdl.validateURL(track.playerInfo.link)) {
      message.channel.send("No results found");
    }
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("No voice channel.");
    let stream = ytdl(track.playerInfo.link, {
      filter: "audioonly",
      opusEncoded: true,
    });

    let dispatcher = await voiceChannel.join();
    dispatcher.on("finish", () => {
      dispatcher.disconnect();
    });
    dispatcher.play(stream, { type: "opus" });

    statusMsg(track, message.channel, "playing");

    let musicPlayer = musicPlayerInstance(message.channel);
    if (!musicPlayer.isQueueEmpty()) {
      musicPlayer.clearQueue();
    }
    musicPlayer.addSong(track);
  }
};
