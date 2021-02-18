const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const cache = require("../../functions/cache");
const play = require("../../functions/music/play");
const find = require("../../functions/music/playlist/find");
const show = require("../../functions/music/playlist/show");
const add = require("../../functions/music/playlist/add");
const getplaylist = require("../../functions/music/getplaylist");
const clear = require("../../functions/music/playlist/clear");
module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "playlist_clear",
      group: "music",
      memberName: "playlist_clear",
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
