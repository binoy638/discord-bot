const Commando = require("discord.js-commando");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "restart",
      group: "misc",
      memberName: "restart",
      description: "Restart the bot.",
      ownerOnly: true,
    });
  }
  async run(message) {
    setTimeout(() => {
      process.exit();
    }, 2000);
    message.reply("Restarting the bot...");
  }
};
