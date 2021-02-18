const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const cache = require("../../functions/cache");
const play = require("../../functions/music/play");
const find = require("../../functions/music/playlist/find");
const show = require("../../functions/music/playlist/show");
module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "playlist",
      group: "music",
      memberName: "playlist",
      aliases: ["pl"],
      description: "Manage your playlist.",
      args: [
        {
          key: "operation",
          prompt: "What you want to do with your playlist?",
          type: "string",
          // default: "show",
          oneOf: ["play", "show", "clear"],
        },
      ],
    });
  }
  async run(message, args) {
    const prefix = message.guild._commandPrefix;
    const { channel } = message.channel;
    const { username } = message.member.user;
    const { id } = message.member.user;
    const playlist = await find(id);
    if (playlist) {
      const operation = args.operation;
      switch (operation) {
        case "show":
          show(playlist, channel, username, prefix);
          console.log(operation);
          break;
        case "play":
          console.log(operation);
          break;
        // case "add":
        //   console.log(operation);
        //   console.log(args);
        //   break;
        case "clear":
          console.log(operation);
          break;
      }
    }
    return message.reply("You don't have a active playlist.");
  }
};
