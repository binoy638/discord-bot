const Commando = require("discord.js-commando");

const { find, clear } = require("../../functions/music/playlist/helper");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "playlistdelete",
      group: "music",
      memberName: "9playlistclear",
      aliases: ["playlist_delete", "playlistdel", "delete", "del"],
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
    const prefix = message.guild._commandPrefix;
    const { id } = message.member.user;
    if (choice === "yes") {
      const playlist = await find(id);
      if (!playlist) {
        return message.reply(
          `You don't have any playlist currently.\nUse \`${prefix}playlistadd\` to create a playlist.`
        );
      }
      await clear(id, message.channel);
      message.reply("Playlist deleted.");
    }
  }
};
