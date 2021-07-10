const Commando = require("discord.js-commando");
const { ErrorEmbed } = require("../../utils/embed");
const checkUserVc = require("../../utils/checkUserVc");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "skip",
      group: "music",
      aliases: ["fs"],
      memberName: "5skip",
      description: "Skip currently playing song.",
    });
  }
  async run(message, clicker) {
    const { channel } = message;
    const id = clicker?.user?.id || message.member.user.id;
    let voiceConnection = message.guild.me.voice.connection;

    if (!voiceConnection) {
      return ErrorEmbed("No Song is playing to skip ⏭️", channel);
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
      return ErrorEmbed("No Song is playing to skip ⏭️", channel);
    }

    dispatcher.end();
  }
};
