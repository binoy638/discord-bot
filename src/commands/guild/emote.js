const mongo = require("../../configs/mongo");
const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const guildEmote = require("../../models/guildEmote");
const { ErrorEmbed, SuccessEmbed } = require("../../utils/embed");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "emote",
      group: "guild",
      memberName: "emote",
      description: "Use custom emotes available to the guild.",
      args: [
        {
          key: "alias",
          prompt: "Enter emote name.",
          type: "string",
        },
        {
          key: "mentionedUsers",
          prompt: "Mention a user.",
          type: "member",
          infinite: true,
          default: "",
        },
      ],
    });
  }
  async run(message, args) {
    const { channel, guild } = message;
    const { alias, mentionedUsers } = args;

    if (alias.startsWith("<"))
      return ErrorEmbed("No emote alias provided.", channel);

    try {
      await mongo().then(async (mongoose) => {
        const emote = await guildEmote.findOne(
          { guild: guild.id },
          {
            emotes: { $elemMatch: { alias: alias } },
          }
        );
        const {
          emotes: [foundEmote],
        } = emote;

        if (!foundEmote)
          return ErrorEmbed(
            `Emote with alias \`${alias}\` not found.`,
            channel
          );

        const embed = new Discord.MessageEmbed()
          .setDescription(
            `${mentionedUsers ? mentionedUsers.map((user) => user.user) : ""}`
          )
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setImage(foundEmote.url);

        message.delete();
        channel.send(embed);
      });
    } catch (error) {
      console.error(error);
    }
  }
};
