const Commando = require("discord.js-commando");
const axios = require("axios");
const Discord = require("discord.js");
const { CacheSetex } = require("../../utils/cache");

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
    // CacheSetex("test:123", 10, "true");
    // console.log("key added");
  }
};
