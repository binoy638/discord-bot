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

const animeEmbed = (anime, index) => {
  const newIndex = Number(index) + 1;

  return new Discord.MessageEmbed()
    .setTitle(anime.title)
    .setURL(anime.url)
    .setImage(anime.image_url)
    .addFields(
      { name: "Synopsis", value: anime.synopsis || "NA" },
      { name: "Episodes", value: anime.episodes || "NA", inline: true },
      { name: "Score", value: anime.score || "NA", inline: true },
      { name: "Airing", value: anime.airing ? "✅" : "❌", inline: true }
    )
    .setFooter(`ID: ${anime.mal_id}     Index: ${newIndex}`);
};

const ErrorEmbed = (msg, channel) => {
  const embed = new Discord.MessageEmbed()
    .setDescription(`${msg}`)
    .setColor("#e51013");
  channel.send(embed);
};

const SuccessEmbed = (msg, channel) => {
  const embed = new Discord.MessageEmbed()
    .setDescription(`${msg}`)
    .setColor("#3cf42c");
  channel.send(embed);
};

module.exports = {
  RedditEmbed,
  NineGagEmbed,
  ErrorEmbed,
  SuccessEmbed,
  animeEmbed,
};
