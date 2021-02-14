const Discord = require("discord.js");
const api = require("imageapi.js");

const Commando = require("discord.js-commando");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "meme",
      group: "fun",
      memberName: "meme",
      description: "Get a random meme from a reddit",
    });
  }
  async run(message) {
    let subreddits = ["memes", "meme", "funny"];
    let subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

    let img = await api(subreddit);

    const Embed = new Discord.MessageEmbed().setColor("RANDOM").setImage(img);

    message.channel.send(Embed);
  }
};
