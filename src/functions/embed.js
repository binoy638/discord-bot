const Discord = require("discord.js");
const { htmlUnescape } = require("escape-goat");

const RedditEmbed = (post, type = "image") => {
  if (!post) return null;
  let Embed;
  if (type === "image") {
    Embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(post.title)
      .setURL(post.url)
      .setImage(post.url);
  } else {
    Embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(post.title)
      .setURL(post.url);
  }

  return Embed;
};

const NineGagEmbed = (data, channel) => {
  let Title = htmlUnescape(data.title);
  if (Title.length > 250) {
    Title = Title.slice(0, 50) + "....";
  }
  const gag = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle(Title)
    .setURL(data["url"]);

  if (data["type"] === "Photo") {
    gag.setImage(data["content"]);
    channel.send(gag);
  } else {
    channel.send({ embed: gag });
    channel.send(data["content"]);
  }
};

module.exports = { RedditEmbed, NineGagEmbed };
