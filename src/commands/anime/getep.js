const axios = require("axios");
const Commando = require("discord.js-commando");
module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "episode",
      group: "anime",
      memberName: "episode",
      description: "Get the last released anime.",
    });
  }
  async run(message, args) {
    let id = args;
    const Embed = new Discord.MessageEmbed().setColor("#0099ff");
    axios
      .get(`https://udility.herokuapp.com/anime_first/${id}`)
      .then((res) => {
        if (res.data["title"]) {
          Embed.setTitle(`${res.data["title"]}-${res.data["episode"]}`)
            .setURL(`https://myanimelist.net/anime/${id}`)
            .addFields(
              {
                name: "480p",
                value: `[Open](https://udility.herokuapp.com/redirect/${res.data["480"]})`,
                inline: true,
              },
              {
                name: "720p",
                value: `[Open](https://udility.herokuapp.com/redirect/${res.data["720"]})`,
                inline: true,
              },
              {
                name: "1080p",
                value: `[Open](https://udility.herokuapp.com/redirect/${res.data["1080"]})`,
                inline: true,
              }
            );

          message.channel.send(Embed);
        } else {
          message.channel.send("Episode not found!");
        }
      })
      .catch((err) => {
        console.error("Sever error 500");
        message.channel.send("Episode not found!");
      });
  }
};
