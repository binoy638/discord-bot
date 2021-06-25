const statusMsg = require("../../functions/music/statusMsg");
const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "resume",
      group: "music",
      aliases: ["rs"],
      memberName: "3resume",
      description: "Resume currently paused song.",
    });
  }
  async run(message) {
    let voiceConnection = message.guild.me.voice.connection;

    if (!voiceConnection) {
      return message.channel.send("`No Song to resume! 🎵`");
    }
    let dispatcher = voiceConnection.dispatcher;
    if (!dispatcher) {
      return message.channel.send("`No Song resume! 🎵`");
    }
    if (!dispatcher.paused) {
      return message.channel.send("`Song is already playing! 🎵`");
    }
    dispatcher.resume();
    dispatcher.pause();
    dispatcher.resume();

    const musicPlayer = musicPlayerInstance(message.channel);
    const playerMsg = musicPlayer.message;
    if (musicPlayer) {
      const currentSong = musicPlayer.currentSong();
      musicPlayer.setStatus(1);
      return statusMsg(currentSong, message.channel, "playing", playerMsg);
    }
    message.channel.send("`Resumed 🎵`");
  }
};
