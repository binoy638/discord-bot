const Commando = require("discord.js-commando");
const { ErrorEmbed, SuccessEmbed } = require("../../utils/embed");
const musicPlayerInstance = require("../../utils/music/musicPlayerInstance");

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
    const { channel } = message;
    const musicPlayer = musicPlayerInstance(message.channel);
    if (musicPlayer.isQueueEmpty() === true) {
      return ErrorEmbed("No tracks in queue to shuffle.", channel);
    }
    musicPlayer.shufflePlaylist();

    SuccessEmbed("Playlist shuffled.", channel);
  }
};
