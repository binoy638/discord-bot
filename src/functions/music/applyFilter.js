const play = require("./play");

const calTimeErr = (filter) => {
  if (filter === "atempo=1.06,asetrate=44100*1.25") {
    return 1.25;
  } else if (filter === "aresample=48000,asetrate=48000*0.8") {
    return 0.8;
  } else {
    return 1;
  }
};

module.exports = (filterArgs, connection, channel, musicPlayer) => {
  const TimeError = calTimeErr(musicPlayer.audioFilter);
  musicPlayer.setAudioFilter(filterArgs);
  let seekTime = 0;
  try {
    seekTime =
      (connection.dispatcher.streamTime / 1000 + musicPlayer.seek) * TimeError;
    musicPlayer.setSeekTime(Number(seekTime));
  } catch (e) {
    console.log(e);
  }
  play(connection, channel, musicPlayer, seekTime);
};
