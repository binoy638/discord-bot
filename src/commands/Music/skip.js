const cache = require("../../functions/cache");
const statusMsg = require("../../functions/music/statusMsg");
const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "skip",
      group: "music",
      aliases: ["fs"],
      memberName: "skip",
      description: "Pause currently playing song.",
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

    message.channel.send("`Skipped ⏭️`");
  }
};
