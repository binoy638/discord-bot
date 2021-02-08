var myprefix = require("../../bot");
const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "List all of my commands.",
  category: "Misc",
  active: true,
  aliases: ["commands"],
  usage: "[command name]",

  cooldown: 5,
  execute(message, args) {
    const Embed = new Discord.MessageEmbed();
    const categories = [
      { title: "Music", description: "🎧 commands to play music 🎧" },
      { title: "Memes", description: "🐸 commands to get memes 🐸" },
      { title: "Anime", description: "💠 anime specific commands 💠" },
      { title: "Gaming", description: "🎮 gaming specific commands 🎮" },
      { title: "Guild", description: "🔴 guild specific commands 🔴" },
      { title: "Misc", description: "🔘 miscellaneous commands 🔘" },
    ];
    let cmdarg = args.join(" ");
    if (!cmdarg) {
      Embed.setColor("RANDOM").setAuthor(
        `${message.client.user.username}`,
        "https://i.imgur.com/qHGBdPT.png"
      );
      // activecmd.map((command) =>
      //   Embed.addField(
      //     `${myprefix.prefix}${command.name}`,
      //     `\`${command.description}\``
      //   )
      // );
      categories.map((category) =>
        Embed.addField(`${category.title}`, `\`${category.description}\``)
      );

      return message.channel.send(Embed);
    }
    cmdarg = cmdarg[0].toUpperCase() + cmdarg.substring(1);

    const isvaildcmdarg = categories.some((cat) => cat.title === cmdarg);
    if (isvaildcmdarg) {
      const { commands } = message.client;
      const activecmd = commands.filter(
        (command) => command.active === true && command.category === cmdarg
      );
      Embed.setColor("RANDOM")
        .setTitle(cmdarg)
        .setAuthor(
          `${message.client.user.username}`,
          "https://i.imgur.com/qHGBdPT.png"
        );
      activecmd.map((command) =>
        Embed.addField(
          `${myprefix.prefix}${command.name} ${
            command.usage ? command.usage : " "
          }`,
          `\`${command.description}\``
        )
      );
      return message.channel.send(Embed);
    }
    return message.channel.send("Invalid command type!");
    // console.log(isvaildcmdarg);
  },
};
