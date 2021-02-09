const ytdl = require("discord-ytdl-core");
const MusicPlayer = require("../../functions/music/musicPlayer");

const search = require("../../functions/music/search");
const statusMsg = require("../../functions/music/statusMsg");
const cache = require("../../functions/cache");
module.exports = {
  name: "play",
  usage: "[song name]",
  category: "Music",
  description: "Play music in a voice channel",
  active: true,
  args: true,

  async execute(message, args) {
    const query = args.join(" ");
    let result = cache.get(`SongQuery:${query}`);
    if (!result) {
      result = await search(query);

      cache.set(`SongQuery:${query}`, result);
    }

    if (!result) {
      message.channel.send("No results found");
    }
    if (!ytdl.validateURL(result.link)) {
      message.channel.send("No results found");
    }
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("No voice channel.");
    let stream = ytdl(result.link, {
      filter: "audioonly",
      opusEncoded: true,
    });

    let dispatcher = await voiceChannel.join();

    dispatcher.play(stream, { type: "opus" });
    statusMsg(result, message.channel, "playing");

    const musicPlayer = new MusicPlayer(message.channel.id, voiceChannel.id);
    if (!musicPlayer.isQueueEmpty()) {
      musicPlayer.clearQueue();
    }
    musicPlayer.addSong(result);

    cache.set(message.channel.id, musicPlayer);
  },
};
