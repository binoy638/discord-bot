const mongo = require("../../configs/mongo");
const axios = require("axios");
const Commando = require("discord.js-commando");
const guildEmote = require("../../models/guildEmote");
const Discord = require("discord.js");
const { ErrorEmbed } = require("../../utils/embed");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "emote_add",
      group: "guild",
      memberName: "emote_add",
      userPermissions: ["MANAGE_EMOJIS"],
      description: "Add custom emote to the guild.",
      args: [
        {
          key: "url",
          prompt: "Enter the bttv emote link.",
          type: "string",
        },
        {
          key: "name",
          prompt: "Enter emote name.",
          type: "string",
          default: "",
        },
      ],
    });
  }
  async run(message, args) {
    const prefix = message.guild._commandPrefix || "!";
    const { guild, channel } = message;
    const { url, name } = args;

    const urlType = validateUrl(url);

    if (urlType === 0) return ErrorEmbed("Invalid emote url.", channel);
    else if (urlType === 1)
      return ErrorEmbed("I can only accept bttv emotes currently.", channel);

    const emoteID = url.split("/").pop();
    try {
      const { data } = await axios.get(
        `https://api.betterttv.net/3/emotes/${emoteID}`
      );
      const { imageType, code } = data;

      const emote = {
        id: emoteID,
        type: imageType,
        alias: name ? name : code,
      };

      await mongo().then(async (mongoose) => {
        const isAliasExist = await guildEmote.findOne(
          { guild: guild.id },
          {
            emotes: { $elemMatch: { alias: emote.alias } },
          }
        );

        if (isAliasExist && isAliasExist.emotes.length)
          return ErrorEmbed(
            `Emote with alias \`${emote.alias}\` already exists.`,
            channel
          );
        const isIDExist = await guildEmote.findOne(
          { guild: guild.id },
          {
            emotes: { $elemMatch: { id: emote.id } },
          }
        );
        if (isIDExist && isIDExist.emotes.length)
          return ErrorEmbed(
            `This emote already exists with the alias \`${isIDExist.emotes[0].alias}\``,
            channel
          );

        const addEmote = await guildEmote.findOneAndUpdate(
          { guild: guild.id },
          { $push: { emotes: emote } },
          {
            upsert: true,
            new: true,
          }
        );

        if (addEmote) {
          const embed = new Discord.MessageEmbed()
            .setTitle("New Emote Added ✅ ")
            .setDescription(
              `\**Alias\**:${emote.alias}\nUse \`${prefix}emote ${emote.alias}\``
            )
            .setImage(
              `https://cdn.betterttv.net/emote/${emote.id}/3x${
                emote.type === "gif" ? ".gif" : ""
              }`
            );
          channel.send(embed);
        }
      });
    } catch (error) {
      ErrorEmbed(`Something went wrong, please try again later`, channel);
      console.error(error);
    }
  }
};

//helper functions
const validateUrl = (url) => {
  const urlregex =
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  if (urlregex.test(url)) {
    if (url.includes("betterttv.com/emotes")) return 2;
    return 1;
  }
  return 0;
};
