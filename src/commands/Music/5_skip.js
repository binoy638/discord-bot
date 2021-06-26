const Commando = require("discord.js-commando");

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
    const id = clicker?.user?.id || message.member.user.id;
    let voiceConnection = message.guild.me.voice.connection;

    if (!voiceConnection) {
      return message.channel.send("`No Song is playing to skip ⏭️`");
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
      return message.channel.send("`No Song is playing to skip ⏭️`");
    }

    dispatcher.end();

    // message.channel.send("`Skipped ⏭️`");
  }
};
