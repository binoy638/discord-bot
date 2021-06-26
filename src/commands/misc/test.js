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
    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("New Episode of Megalo Box Season 2 is out")
      .setDescription(`Megalo Box season 2 \nEpisode: 5`)
      .setImage("https://cdn.myanimelist.net/images/anime/1190/113352.jpg")
      .setFooter("Next episode will be out on 12:00(IST)");

    message.channel.send({ embed, components: animeButtons });
  }
};
