const cache = require("../../cache");
const MusicPlayer = require("../musicPlayer");

module.exports = async (channel, connection, playlist, trackno) => {
  //   console.log(channel.guild.id);
  let musicPlayer = cache.get(`MusicPlayer-${channel.guild.id}`);
  if (!musicPlayer) {
    musicPlayer = new MusicPlayer(channel.id);
  }

  musicPlayer.clearQueue();
  musicPlayer.addplaylist(playlist);
  //   console.log(musicPlayer.showQueue());

  function playSong(link, connection) {
    let stream = ytdl(link, {
      filter: "audioonly",
      opusEncoded: true,
    });
    connection.play(stream, { type: "opus" });
  }
};
