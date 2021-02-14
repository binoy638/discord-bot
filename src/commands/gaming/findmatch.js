const axios = require("axios");
const Discord = require("discord.js");
const Commando = require("discord.js-commando");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "findd2match",
      group: "gaming",
      memberName: "findd2match",
      description: "Find dota 2 match id of a twitch clip.",
      args: [
        {
          key: "matchurl",
          prompt: "Please provide a twitch clip url or slug.",
          type: "string",
        },
      ],
    });
  }
  async run(message, args) {
    let url = args.matchurl;
    let slug = url.split("/").pop();
    const Embed = new Discord.MessageEmbed().setColor("#0099ff");
    Embed.setTitle("Searching...").setDescription(
      "This might take few seconds."
    );
    let firstmsg = await message.channel.send(Embed);
    axios
      .get(`https://fast-api-twitch.herokuapp.com/find/${slug}`)
      .then((res) => {
        if (res.data["ID"]) {
          Embed.setTitle("Match Found")
            .setDescription("")
            .addField("ID", `${res.data["ID"]}`)

            .addField(
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

          firstmsg.edit(Embed);
        } else {
          Embed.setTitle("Sorry, I couldn't a match").setDescription("");
          firstmsg.edit(Embed);
        }
      })
      .catch((err) => {
        console.error("Sever error 500");

        Embed.setTitle("Sorry, I couldn't a match").setDescription("");
        firstmsg.edit(Embed);
      });
  }
};
