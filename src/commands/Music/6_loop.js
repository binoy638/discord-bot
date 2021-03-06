const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "loop",
      group: "music",
      memberName: "loop",
      description: "loop currently queued tracks or playlist.",
    });
  }
  async run(message) {
    const musicPlayer = musicPlayerInstance(message.channel);
    if (musicPlayer.isQueueEmpty() === true) {
      return message.reply("No tracks in queue to loop.");
    }
    const status = musicPlayer.loop();
    if (status === true) {
      message.reply(
        "loop enabled for currently queued tracks.Use to command again to disable it."
      );
    } else {
      message.reply(
        "loop disabled for currently queued tracks.Use to command again to enable it."
      );
    }
  }
};
