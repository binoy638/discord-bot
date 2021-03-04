const Commando = require("discord.js-commando");
const animesublistclear = require("../../functions/animeAlerts/animesublistclear");
const queryType = require("../../functions/music/queryType");
const ninegagsublistclear = require("../../functions/ninegag/ninegagsublistclear");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "test",
      group: "misc",
      memberName: "test",
      description: "test features",
      ownerOnly: true,
    });
  }
  async run(message, args) {
    animesublistclear(message.channel.guild.id);
    ninegagsublistclear(message.channel.guild.id);
  }
};
