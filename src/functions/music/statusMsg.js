const Discord = require("discord.js");
module.exports = (data, channel, status) => {
  const musicEmbed = new Discord.MessageEmbed()
    .setTitle(data.playerInfo.title)

    .setURL(data.playerInfo.link)
    .setThumbnail(data.playerInfo.image);

  if (status === "playing") {
    musicEmbed.setDescription("Playing 🎵");
  } else if (status === "paused") {
    musicEmbed.setDescription("Paused ⏸️");
  }
  channel.send(musicEmbed);
};
