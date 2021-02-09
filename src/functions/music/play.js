const ytdl = require("discord-ytdl-core");
const MusicPlayer = require("./musicPlayer");

const search = require("./search");
const statusMsg = require("./statusMsg");
const cache = require("../cache");

module.exports = async (channel, connection, query) => {
  let result = cache.get(`SongQuery:${query}`);
  if (!result) {
    result = await search(query);

    cache.set(`SongQuery:${query}`, result);
  }

  if (!result) {
    channel.send("No results found");
  }
  if (!ytdl.validateURL(result.link)) {
    channel.send("No results found");
  }

  let stream = ytdl(result.link, {
    filter: "audioonly",
    opusEncoded: true,
  });

  //   let dispatcher = await voiceChannel.join();
  //   let dispatcher = connection.dispatcher;

  connection.play(stream, { type: "opus" });
  statusMsg(result, channel, "playing");

  const musicPlayer = new MusicPlayer(channel.id, connection.id);
  if (!musicPlayer.isQueueEmpty()) {
    musicPlayer.clearQueue();
  }
  musicPlayer.addSong(result);

  cache.set(channel.id, musicPlayer);
};
