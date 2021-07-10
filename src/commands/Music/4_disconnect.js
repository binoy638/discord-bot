const Commando = require("discord.js-commando");
const { ErrorEmbed } = require("../../utils/embed");
const musicPlayerInstance = require("../../utils/music/musicPlayerInstance");
const checkUserVc = require("../../utils/checkUserVc");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "disconnect",
      group: "music",
      aliases: ["dc"],
      memberName: "4disconnect",
      description: "Make the bot leave a voice channel.",
    });
  }
  async run(message, clicker) {
    const { channel } = message;
    const id = clicker?.user?.id || message.member.user.id;
    const connection = message.guild.me.voice.channel;
    if (!connection) {
      ErrorEmbed;
      return ErrorEmbed("I am not connected to a voice channel.", channel);
    }
    const voiceChannelMembers = message.guild.me.voice.channel.members;

    const isUserInVC = checkUserVc(voiceChannelMembers, id);

    if (!isUserInVC)
      return ErrorEmbed(
        `<@${id}> You must be in the same voice channel to use this command.`,
        channel
      );
    const musicPlayer = musicPlayerInstance(message.channel);
    const msg = musicPlayer.message;
    await msg.delete();

    connection.leave();
  }
};
