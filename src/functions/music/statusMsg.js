const Discord = require("discord.js");
module.exports = (data, channel) => {
  const musicEmbed = new Discord.MessageEmbed()
    .setTitle(data.title)
    .setDescription("Playing :notes:")
    .setURL(data.link)
    .setThumbnail(data.image);

  //   if (data["type"] === "Photo") {

  channel.send(musicEmbed);
  //   } else {
  //     channel.send({ embed: gag });
  //     channel.send(data["content"]);
  //   }
};
