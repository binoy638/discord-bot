const Discord = require("discord.js");
module.exports = async (data, channel, status) => {
  const musicEmbed = new Discord.MessageEmbed()
    .setTitle(data.playerInfo.title)

    .setURL(data.playerInfo.link)
    .setThumbnail(data.playerInfo.image);

  if (status === "playing") {
    musicEmbed.setDescription("Playing 🎵");
  } else if (status === "paused") {
    musicEmbed.setDescription("Paused ⏸️");
  }
  const msg = await channel.send(musicEmbed);
  return msg;
};
