const Commando = require("discord.js-commando");
const { ErrorEmbed, SuccessEmbed } = require("../../utils/embed");
const musicPlayerInstance = require("../../utils/music/musicPlayerInstance");
const checkUserVc = require("../../utils/checkUserVc");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "shuffle",
      group: "music",
      aliases: ["sh", "shufl"],
      memberName: "2shuffle",
      description: "Shuffle currently queued tracks or playlist.",
    });
  }
  async run(message, clicker) {
    const { channel } = message;
    const id = clicker?.user?.id || message.member.user.id;
    let voiceConnection = message.guild.me.voice.connection;
    if (!voiceConnection) {
      return ErrorEmbed("No tracks in queue to shuffle.", channel);
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
      return ErrorEmbed("No tracks in queue to shuffle.", channel);
    }
    musicPlayer.shufflePlaylist();
    SuccessEmbed("Playlist shuffled.", channel);

    let dispatcher = voiceConnection.dispatcher;
    if (!dispatcher) return;
    dispatcher.end();
  }
};
