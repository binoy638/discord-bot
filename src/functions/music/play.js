const ytdl = require("discord-ytdl-core");
const statusMsg = require("./statusMsg");
const { infoFromQuery } = require("./search");
const { addplayerInfo } = require("./playlist/helper");

const play = async (
  connection,
  channel,
  musicPlayer,
  seekTime,
  hasFilter = false
) => {
  let currentSong = musicPlayer.currentSong();
  if (!currentSong) {
    return;
  }
  if (!currentSong.playerInfo) {
    const searchQuery = `${currentSong.artists} ${currentSong.track}`;
    const PlayerInfo = await infoFromQuery(searchQuery);
    currentSong.playerInfo = PlayerInfo.playerInfo;
    addplayerInfo(id, currentSong);
  }

  const filter = musicPlayer.audioFilter;
  const stream = ytdl(currentSong.playerInfo.link, {
    filter: "audioonly",
    opusEncoded: true,
    encoderArgs: ["-af", filter],
    bitrate: 320,
    seek: seekTime ? seekTime : 0,
    quality: "highestaudio",
    liveBuffer: 40000,
    highWaterMark: 1 << 25,
  });
  const dispatcher = await connection.play(stream, { type: "opus" });
  musicPlayer.setStatus(1);
  let msg;
  if (!hasFilter) {
    msg = await statusMsg(currentSong, channel, "playing");
  }

  dispatcher.on("finish", () => {
    musicPlayer.setSeekTime(0);
    musicPlayer.nextSong();
    if (msg) {
      msg.delete();
    }
    if (musicPlayer.isQueueEmpty() === true) {
      connection.disconnect();
    } else {
      setTimeout(() => {
        play(connection, channel, musicPlayer);
      }, 1000);
    }
  });
};

module.exports = play;
