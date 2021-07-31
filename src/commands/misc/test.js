const Commando = require("discord.js-commando");
const axios = require("axios");
const Discord = require("discord.js");
const animeButtons = require("../../buttons/animeButtons");
const { CacheSetex, CacheGet } = require("../../utils/cache");
const client = require("../..");
const buttons = require("discord-buttons");
const { agenda } = require("../../configs/agenda");
const { job } = require("cron");
// const {newFn} = require("../../utils/anime/testfn");
const test = require("../..");

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
    const { channel } = message;
    CacheSetex(`testJob-${channel.id}`, 5, "true");
    console.log("key added");
  }
};
