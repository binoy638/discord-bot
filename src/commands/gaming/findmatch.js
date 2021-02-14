const axios = require("axios");
const Discord = require("discord.js");
const Commando = require("discord.js-commando");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "findmatch",
      group: "gaming",
      memberName: "findmatch",
      description: "Get regular memes from a specific 9gag section",
    });
  }
  async run(message, args) {
    let url = args;
    let slug = url.split("/").pop();
    const Embed = new Discord.MessageEmbed().setColor("#0099ff");
    axios
      .get(`https://fast-api-twitch.herokuapp.com/find/${slug}`)
      .then((res) => {
        if (res.data["ID"]) {
          Embed.addField("Match ID", `${res.data["ID"]}`);
          Embed.addField(
            "Opendota",
            `https://www.opendota.com/matches/${res.data["ID"]}`
          );
          Embed.addField(
            "Dotabuff",
            `https://www.dotabuff.com/matches/${res.data["ID"]}`
          );
          Embed.addField(
            "Stratz",
            `https://stratz.com/matches/${res.data["ID"]}`
          );
          message.channel.send(Embed);
        } else {
          message.channel.send("Match not found!");
        }
      })
      .catch((err) => {
        console.error("Sever error 500");
        message.channel.send("Match not found!");
      });
  }
};
