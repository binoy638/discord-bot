const cache = require("../../functions/cache");
const statusMsg = require("../../functions/music/statusMsg");
const Commando = require("discord.js-commando");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "pause",
      group: "music",
      memberName: "pause",
      description: "Pause currently playing song.",
    });
  }
  async run(message) {
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
  }
};
