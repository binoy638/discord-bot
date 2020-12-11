const Discord = require("discord.js");
const api = require("imageapi.js");

module.exports = {
  name: "meme",
  description: "Get a random image from r/memes,r/meme or r/funny.",
  active: true,
  async execute(message, args) {
    let subreddits = ["memes", "meme", "funny"];
    let subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

    let img = await api(subreddit);

    const Embed = new Discord.MessageEmbed().setColor("RANDOM").setImage(img);

    message.channel.send(Embed);
  },
};
