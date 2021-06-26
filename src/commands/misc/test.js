const Commando = require("discord.js-commando");
const { MessageButton, MessageActionRow } = require("discord-buttons");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "test",
      group: "misc",
      memberName: "test",
      description: "test features",
      ownerOnly: true,
    });
  }
  async run(message, args) {
    let voiceChannelMembers = message.guild.me.voice.channel.members;
    voiceChannelMembers.map((m) => console.log(m.user.tag));
  }
};
