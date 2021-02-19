const Commando = require("discord.js-commando");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "disconnect",
      group: "music",
      aliases: ["dc"],
      memberName: "disconnect",
      description: "Make the bot leave a voice channel.",
    });
  }
  async run(message) {
    const connection = message.guild.me.voice.channel;
    if (!connection) {
      return message.reply("I am not connected to a voice channel.");
    }

    connection.leave();
  }
};
