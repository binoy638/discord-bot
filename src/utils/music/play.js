const ytdl = require("discord-ytdl-core");
const statusMsg = require("./statusMsg");
const { infoFromQuery } = require("./search");
const { addplayerInfo } = require("./playlist/helper");
const Discordcollection = require("../misc/Discordcollection");

const play = async (connection, channel, musicPlayer, seekTime, id = null) => {
  let currentSong = musicPlayer.currentSong();
  if (!currentSong) {
    return;
  }
  if (!currentSong.playerInfo) {
    const searchQuery = `${currentSong.artists} ${currentSong.track}`;
    const PlayerInfo = await infoFromQuery(searchQuery);
    currentSong.playerInfo = PlayerInfo.playerInfo;
    if (id) {
      addplayerInfo(id, currentSong);
    }
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

  let msg = musicPlayer.message;
  if (!msg) {
    msg = await statusMsg(currentSong, channel, "playing");
    musicPlayer.message = msg;
  } else {
    statusMsg(currentSong, channel, "playing", msg);
  }

  dispatcher.on("finish", () => {
    musicPlayer.setSeekTime(0);
    musicPlayer.nextSong();

    if (musicPlayer.isQueueEmpty() === true) {
      connection.disconnect();
      msg.delete();
    } else {
      setTimeout(() => {
        play(connection, channel, musicPlayer);
      }, 1000);
    }
  });
};

module.exports = play;
