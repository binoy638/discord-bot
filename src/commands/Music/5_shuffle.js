const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "shuffle",
      group: "music",
      aliases: ["sh", "shufl"],
      memberName: "2shuffle",
      description: "Shuffle currently queued tracks or playlist.",
    });
  }
  async run(message) {
    const musicPlayer = musicPlayerInstance(message.channel);
    if (musicPlayer.isQueueEmpty() === true) {
      return message.reply("No tracks in queue to shuffle.");
    }
    musicPlayer.shufflePlaylist();
    message.reply("Playlist shuffled.");
  }
};
