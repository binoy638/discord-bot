const Discord = require("discord.js");
const playerButtons = require("../../buttons/playerButtons");

module.exports = async (data, channel, status, message) => {
  const musicEmbed = new Discord.MessageEmbed()
    .setTitle(data.playerInfo.title || "NA")

    .setURL(data.playerInfo.link || "NA")
    .setThumbnail(data.playerInfo.image || "NA");

  let buttons;

  if (status === "playing") {
    musicEmbed.setDescription("Playing 🎵");
    buttons = playerButtons("play");
  } else if (status === "paused") {
    musicEmbed.setDescription("Paused ⏸️");
    buttons = playerButtons("pause");
  } else {
    throw new Error("Invalid status message type");
  }

  if (message) {
    message.edit({
      embed: musicEmbed,
      components: buttons,
    });
  } else {
    const msg = await channel.send({
      embed: musicEmbed,
      components: buttons,
    });
    return msg;
  }
};
