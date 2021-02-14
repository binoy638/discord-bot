var os = require("os");
const Commando = require("discord.js-commando");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "mem",
      group: "misc",
      memberName: "mem",
      description: "Check memory usage",
      ownerOnly: true,
    });
  }
  async run(message) {
    const usage = process.memoryUsage().heapUsed / 1024 / 1024;
    message.channel.send(`Current memory usage: ${usage.toFixed(2)} MB`);
  }
};
