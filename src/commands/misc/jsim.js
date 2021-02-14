const onJoin = require("../../functions/onJoin");

const Commando = require("discord.js-commando");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "jsim",
      group: "misc",
      memberName: "jsim",
      description: "Simulate a memeber join.",
      ownerOnly: true,
    });
  }
  async run(message, args) {
    onJoin(message.member);
  }
};
