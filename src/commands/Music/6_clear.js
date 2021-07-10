const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../utils/music/musicPlayerInstance");
const Discordcollection = require("../../utils/misc/Discordcollection");
const { ErrorEmbed, SuccessEmbed } = require("../../utils/embed");
const checkUserVc = require("../../utils/checkUserVc");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "clear",
      group: "music",
      aliases: ["clearqueue", "queueclear", "clrqueue", "clr"],
      memberName: "clear",
      description: "Clear track queue.",
    });
  }
  async run(message) {
    const { channel } = message;
    const id = message.member.user.id;

    let voiceConnection = message.guild.me.voice.connection;

    if (!voiceConnection) {
      return ErrorEmbed("Queue is already empty.", channel);
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
      return ErrorEmbed("Queue is already empty.", channel);
    }

    Discordcollection.delete(`MusicPlayer-${message.channel.guild.id}`);

    SuccessEmbed("Queue cleared.", channel);
  }
};
