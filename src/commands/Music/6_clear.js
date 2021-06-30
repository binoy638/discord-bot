const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../utils/music/musicPlayerInstance");
const Discordcollection = require("../../utils/misc/Discordcollection");
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

    Discordcollection.delete(`MusicPlayer-${message.channel.guild.id}`);
    message.reply("Queue cleared.");
  }
};
