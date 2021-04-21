const Discord = require("discord.js");

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

module.exports = { RedditEmbed };
