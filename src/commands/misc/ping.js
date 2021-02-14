var cache = require("../../functions/cache");
const Queue = require("../../functions/utils/queue");
var queue = new Queue();
const Commando = require("discord.js-commando");

module.exports = class AddCommand extends (
  Commando.Command
) {
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
    const { guild } = message;
    console.log(guild._commandPrefix);
    // const g = new Commando.CommandoGuild(guild.id);
    // const current = this.client.guilds.filter(
    //   (currentguild) => currentguild.id === guild.id
    // );
    // console.log(current);
  }
};
