const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../utils/music/musicPlayerInstance");
const checkUserVc = require("../../utils/checkUserVc");
const { ErrorEmbed, SuccessEmbed } = require("../../utils/embed");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "loop",
      group: "music",
      memberName: "loop",
      description: "loop currently queued tracks or playlist.",
    });
  }
  async run(message) {
    const { channel } = message;
    const id = message.member.user.id;

    let voiceConnection = message.guild.me.voice.connection;

    if (!voiceConnection) {
      return ErrorEmbed("No Song is playing to loop", channel);
    }

    const voiceChannelMembers = message.guild.me.voice.channel.members;

    const isUserInVC = checkUserVc(voiceChannelMembers, id);

    if (!isUserInVC)
      return ErrorEmbed(
        `<@${id}> You must be in the same voice channel to use this command.`,
        channel
      );

    const musicPlayer = musicPlayerInstance(message.channel);
    if (musicPlayer.isQueueEmpty() === true) {
      return ErrorEmbed("No tracks in queue to loop.", channel);
    }
    const status = musicPlayer.loop();
    if (status === true) {
      SuccessEmbed(
        "loop enabled for currently queued tracks.Use this command again to disable it.",
        channel
      );
    } else {
      SuccessEmbed(
        "loop disabled for currently queued tracks.Use this command again to enable it.",
        channel
      );
    }
  }
};
