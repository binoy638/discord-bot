const Commando = require("discord.js-commando");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "leave",
      group: "misc",
      memberName: "leave",
      description: "Make the bot leave a voice channel.",
    });
  }
  async run(message, args) {
    const connection = message.guild.me.voice.channel;
    if (!connection) {
      message.reply("I am not connected to a voice channel.");
    }

    connection.leave();
  }
};
