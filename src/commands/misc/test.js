const Commando = require("discord.js-commando");
const getplaylist = require("../../functions/music/getplaylist");

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
    getplaylist("56huKf7lCLHWwLKcN4QHqk?si=BEWibP8FRD6U-RAAX20Eaw");
  }
};
