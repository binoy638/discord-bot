const statusMsg = require("../../utils/music/statusMsg");
const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../utils/music/musicPlayerInstance");
const { ErrorEmbed } = require("../../utils/embed");
const checkUserVc = require("../../utils/checkUserVc");

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
    const { channel } = message;

    if (!voiceConnection) {
      return ErrorEmbed("No Song to resume! 🎵", channel);
    }

    const voiceChannelMembers = message.guild.me.voice.channel.members;

    const isUserInVC = checkUserVc(voiceChannelMembers, id);

    if (!isUserInVC)
      return ErrorEmbed(
        `<@${id}> You must be in the same voice channel to use this command.`,
        channel
      );

    let dispatcher = voiceConnection.dispatcher;
    if (!dispatcher) {
      return ErrorEmbed("`No Song resume! 🎵`", channel);
    }

    if (!dispatcher.paused) {
      return ErrorEmbed("`Song is already playing! 🎵`", channel);
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
  }
};
