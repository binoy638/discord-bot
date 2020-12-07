const Discord = require("discord.js");
const fs = require("fs");
module.exports = {
  name: "em",
  description: "Embed msg",
  execute(message, args) {
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Shiroyashaa98")
      .setAuthor(
        "Valorant Stats",
        "https://pbs.twimg.com/profile_images/1292005670934347776/Lm-l7Ldr_400x400.jpg"
      )

      .setThumbnail(
        "https://trackercdn.com/cdn/tracker.gg/valorant/icons/tiers/12.png"
      )
      .addFields(
        { name: "Matches", value: "300" },
        // { name: "\u200B", value: "\u200B" },

        { name: "Play Time", value: "8D 10H 20M" },
        {
          name: "Inline field title",
          value: "Some value here",
          inline: true,
        },
        { name: "Inline field title", value: "Some value here", inline: true }
      )
      .addField("Inline field title", "Some value here", true)
      .setImage("https://i.imgur.com/wSTFkRM.png")
      .setTimestamp()
      .setFooter("Some footer text here", "https://i.imgur.com/wSTFkRM.png");

    message.channel.send(exampleEmbed);
  },
};
