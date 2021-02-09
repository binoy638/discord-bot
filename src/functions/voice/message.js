const Discord = require("discord.js");
module.exports = (channel) => {
  const embed = new Discord.MessageEmbed()
    .setTitle("Bumblebee Voice Assistant")
    .setAuthor("⚠️ This is an experimental feature.")
    .setDescription("Currently Available voice commands.")
    .addField('Bumblebee play music "music title"', "`Play a song.`")
    .addField("Bumblebee pause music", "`Pause currently playing song.`")
    .addField("Bumblebee resume music", "`Resume currently paused song.`");
  channel.send(embed);
};
