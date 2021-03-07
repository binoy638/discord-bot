const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");

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
    const musicPlayer = musicPlayerInstance(message.channel);
    if (musicPlayer.isQueueEmpty() === true) {
      return message.reply("Queue is already empty.");
    }

    musicPlayer.flushcache_();
    message.reply("Queue cleared.");
  }
};
