const cache = require("../../functions/cache");
const statusMsg = require("../../functions/music/statusMsg");

module.exports = {
  name: "pause",
  description: "Pause the currently playing song.",
  category: "Music",
  active: true,
  async execute(message, args) {
    let voiceConnection = message.guild.me.voice.connection;

    if (!voiceConnection) {
      return message.channel.send("`No Song is playing to pause! ⏸️`");
    }
    let dispatcher = voiceConnection.dispatcher;
    if (!dispatcher) {
      return message.channel.send("`No Song is playing to pause! ⏸️`");
    }
    if (dispatcher.paused) {
      return message.channel.send("`Song is already paused! ⏸️`");
    }
    dispatcher.pause();
    const musicPlayer = cache.get(message.channel.id);
    if (musicPlayer) {
      const currentSong = musicPlayer.currentSong();

      return statusMsg(currentSong, message.channel, "paused");
    }
    message.channel.send("`Paused ⏸️`");
  },
};