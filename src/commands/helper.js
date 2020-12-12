var myprefix = require("../bot");
const Discord = require("discord.js");
const attachment = new Discord.MessageAttachment(".", "bot.png");
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
      .setColor("#0099ff")
      .setTitle("Available Commands")
      .setAuthor(`${message.client.user.username}`, "");
    activecmd.map((command) =>
      Embed.addField(
        `${myprefix.prefix}${command.name}`,
        `${command.description}`
      )
    );

    message.channel.send(Embed);
  },
};
