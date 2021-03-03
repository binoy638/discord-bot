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
  async run(message) {
    let voiceConnection = message.guild.me.voice.connection;

    if (!voiceConnection) {
      return message.channel.send("`No Song is playing to skip ⏭️`");
    }
    let dispatcher = voiceConnection.dispatcher;
    if (!dispatcher) {
      return message.channel.send("`No Song is playing to skip ⏭️`");
    }

    dispatcher.end();

    // message.channel.send("`Skipped ⏭️`");
  }
};
