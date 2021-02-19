const Commando = require("discord.js-commando");
const find = require("../../functions/music/playlist/find");
const clear = require("../../functions/music/playlist/clear");
module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "playlistclear",
      group: "music",
      memberName: "playlistclear",
      aliases: ["playlist_clear", "playlistclr", "clear", "clr"],
      description: "Delete your playlist.",
      args: [
        {
          key: "choice",
          prompt: "Are you sure that you want to delete your playlist?",
          type: "string",
          oneOf: ["yes", "no"],
        },
      ],
    });
  }
  async run(message, args) {
    const choice = args.choice;
    const { id } = message.member.user;
    if (choice === "yes") {
      const playlist = await find(id);
      if (!playlist) {
        return message.channel.send("You don't have a playlist.");
      }
      await clear(id);
      message.channel.send("Playlist deleted.");
    }
  }
};
