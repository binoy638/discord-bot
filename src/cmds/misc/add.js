const Commando = require("discord.js-commando");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "add",
      group: "misc",
      memberName: "add",
      description: "Adds numbers together",
      argsType: "multiple",
    });
  }
  async run(message, args) {
    console.log(message.content);
  }
};
