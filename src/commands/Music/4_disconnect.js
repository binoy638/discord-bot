const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");
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
    const id = clicker?.user?.id || message.member.user.id;
    const connection = message.guild.me.voice.channel;
    if (!connection) {
      return message.reply("I am not connected to a voice channel.");
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
    const musicPlayer = musicPlayerInstance(message.channel);
    const msg = musicPlayer.message;
    await msg.delete();

    connection.leave();
  }
};
