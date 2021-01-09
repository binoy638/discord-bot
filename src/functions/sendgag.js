const Discord = require("discord.js");
module.exports = (data, channel, guild) => {
  const gag = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle(data["title"])
    .setURL(data["url"]);

  if (data["type"] === "Photo") {
    gag.setImage(data["content"]);
    channel.send(gag);
  } else {
    channel.send({ embed: gag });
    channel.send(data["content"]);
  }
};
