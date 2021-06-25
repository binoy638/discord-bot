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
  async run(message) {
    const connection = message.guild.me.voice.channel;
    if (!connection) {
      return message.reply("I am not connected to a voice channel.");
    }

    const musicPlayer = musicPlayerInstance(message.channel);
    const msg = musicPlayer.message;
    await msg.delete();

    connection.leave();
  }
};
