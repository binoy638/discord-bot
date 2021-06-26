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
  async run(message, clicker) {
    const id = clicker?.user?.id || message.member.user.id;
    let voiceConnection = message.guild.me.voice.connection;

    if (!voiceConnection) {
      return message.channel.send("`No Song to resume! 🎵`");
    }

    let voiceChannelMembers = message.guild.me.voice.channel.members;

    let isUserInVC = false;
    voiceChannelMembers.map((member) => {
      if (member.user.id === id) {
        isUserInVC = true;
      }
    });

    if (!isUserInVC)
      return message.channel.send(
        `<@${id}> You must be in the same voice channel to use this command.`
      );

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
