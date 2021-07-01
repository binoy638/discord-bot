const Commando = require("discord.js-commando");
const axios = require("axios");
const Discord = require("discord.js");
const animeButtons = require("../../buttons/animeButtons");

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
    this.client.guilds.cache.forEach((guild) => {
      console.log(`Guild: ${guild.name}\nMembers:`);
      guild.members.cache.each((member) => {
        console.log(member.user.username);
      });
    });
  }
};
