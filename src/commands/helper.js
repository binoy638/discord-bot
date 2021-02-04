var myprefix = require("../bot");
const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "List all of my commands.",
  active: true,
  aliases: ["commands"],
  usage: "[command name]",
  cooldown: 5,
  execute(message, args) {
    // const data = [];
    const { commands } = message.client;
    const activecmd = commands.filter((command) => command.active === true);

    // data.push("Here's a list of all my commands:");
    // data.push(activecmd.map((command) => command.name).join(", "));
    // data.push(
    //   `\nYou can send \`${myprefix.prefix}help [command name]\` to get info on a specific command!`
    // );

    // message.channel.send(data, { split: true });

    const Embed = new Discord.MessageEmbed()
      .setColor("#286F81")
      .setTitle("Available Commands")
      .setAuthor(
        `${message.client.user.username}`,
        "https://i.imgur.com/qHGBdPT.png"
      );
    activecmd.map((command) =>
      Embed.addField(
        `${myprefix.prefix}${command.name}`,
        `\`${command.description}\``
      )
    );

    message.channel.send(Embed);
  },
};
