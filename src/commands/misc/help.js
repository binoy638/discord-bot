const Discord = require("discord.js");
const Commando = require("discord.js-commando");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    const groups = client.registry.groups
      .filter((group) => {
        if (group.id != "commands" && group.id != "util") {
          return group;
        }
      })
      .map((group) => group.id);

    super(client, {
      name: "help",
      group: "misc",
      memberName: "commands1",
      description: "Display list of commands.",
      args: [
        {
          key: "command_name",
          prompt: "Please enter a command name.",
          type: "string",
          oneOf: groups,
          default: "",
        },
      ],
    });
  }
  async run(message, args) {
    // const q = this.client.registry.findGroups("music");

    // const group = q.map((commands) => )

    const commands = this.client.registry.commands.filter(
      (cmd) => cmd.ownerOnly != true
    );

    const prefix = message.guild._commandPrefix;
    const groups = this.client.registry.groups;

    const Embed = new Discord.MessageEmbed();

    let cmdarg = args.command_name.toLowerCase();
    if (!cmdarg) {
      Embed.setColor("RANDOM").setAuthor(
        `${this.client.user.username}`,
        "https://i.imgur.com/qHGBdPT.png"
      );

      groups.map((group) => {
        if (group.id != "commands" && group.id != "util") {
          Embed.addField(`${group.id}`, `\`${group.name}\``);
        }
      });

      return message.channel.send(Embed);
    }

    Embed.setColor("RANDOM")
      .setTitle(cmdarg)
      .setAuthor(
        `${this.client.user.username}`,
        "https://i.imgur.com/qHGBdPT.png"
      );

    commands.map((command) => {
      if (command.groupID === cmdarg) {
        Embed.addField(
          `${prefix}${command.name}`,
          `\`${command.description}\``
        );
        if (command.groupID === "guild") {
          Embed.addField(
            `${prefix}prefix`,
            "`change command prefix for this guild`"
          );
        }
      }
    });

    return message.channel.send(Embed);
  }
};
