const Commando = require("discord.js-commando");
const axios = require("axios");
const Discord = require("discord.js");
const animeButtons = require("../../buttons/animeButtons");
const { CacheSetex } = require("../../utils/cache");
const client = require("../..");
const buttons = require("discord-buttons");

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
    message.channel.send("`Add filter`", select);
  }
};
