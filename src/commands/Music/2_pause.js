const statusMsg = require("../../utils/music/statusMsg");
const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../utils/music/musicPlayerInstance");
const { ErrorEmbed } = require("../../utils/embed");
const checkUserVc = require("../../utils/checkUserVc");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "pause",
      group: "music",
      aliases: ["ps"],
      memberName: "2pause",
      description: "Pause currently playing song.",
    });
  }
  async run(message, clicker) {
    const { channel } = message;
    const id = clicker?.user?.id || message.member.user.id;
    let voiceConnection = message.guild.me.voice.connection;

    if (!voiceConnection) return ErrorEmbed("No music to pause ⏸️", channel);

    const voiceChannelMembers = message.guild.me.voice.channel.members;

    const isUserInVC = checkUserVc(voiceChannelMembers, id);

    if (!isUserInVC)
      return ErrorEmbed(
        `<@${id}> You must be in the same voice channel to use this command.`,
        channel
      );

    let dispatcher = voiceConnection.dispatcher;
    if (!dispatcher) {
      return ErrorEmbed("No music to pause ⏸️", channel);
    }
    if (dispatcher.paused) return ErrorEmbed("Music already paused ⏸️");

    dispatcher.pause();

    const musicPlayer = musicPlayerInstance(message.channel);
    const playerMsg = musicPlayer.message;
    if (musicPlayer) {
      const currentSong = musicPlayer.currentSong();
      musicPlayer.setStatus(2);
      return statusMsg(currentSong, message.channel, "paused", playerMsg);
    }
  }
};
