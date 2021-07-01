const mongo = require("../../configs/mongo");
const Commando = require("discord.js-commando");
const guildEmote = require("../../models/guildEmote");
const { ErrorEmbed, SuccessEmbed } = require("../../utils/embed");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "emote_remove",
      group: "guild",
      memberName: "emote_remove",
      userPermissions: ["MANAGE_EMOJIS"],
      description: "Remove custom emotes from the guild.",
      args: [
        {
          key: "alias",
          prompt: "Enter emote alias.",
          type: "string",
        },
      ],
    });
  }
  async run(message, args) {
    const { guild, channel } = message;
    const { alias } = args;

    try {
      await mongo().then(async (mongoose) => {
        const emote = await guildEmote.findOne(
          { guild: guild.id },
          {
            emotes: { $elemMatch: { alias: alias } },
          }
        );
        if (!emote)
          return ErrorEmbed(`No emote found with alias \`${alias}\``, channel);
        const {
          emotes: [foundEmote],
        } = emote;

        if (!foundEmote)
          return ErrorEmbed(`No emote found with alias \`${alias}\``, channel);

        const deletedEmote = await guildEmote.findOneAndUpdate(
          { guild: guild.id },
          { $pull: { emotes: foundEmote } }
        );
        SuccessEmbed(`Emote Deleted.`, channel);
      });
    } catch (error) {
      ErrorEmbed(`Something went wrong, please try again later`, channel);
      console.error(error);
    }
  }
};
