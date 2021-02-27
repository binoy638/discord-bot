const statusMsg = require("../../functions/music/statusMsg");
const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "pause",
      group: "music",
      aliases: ["ps"],
      memberName: "2pause",
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

    const musicPlayer = musicPlayerInstance(message.channel);
    if (musicPlayer) {
      const currentSong = musicPlayer.currentSong();
      musicPlayer.setStatus(2);
      return statusMsg(currentSong, message.channel, "paused");
    }
    message.channel.send("`Paused ⏸️`");
  }
};
