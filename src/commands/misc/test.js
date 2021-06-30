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
    try {
      const { data } = await axios.get(
        `https://udility.herokuapp.com/anime/40729`
      );
    } catch (error) {
      console.error(error.response.status);
    }
  }
};
