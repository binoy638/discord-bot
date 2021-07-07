const mongo = require("../../configs/mongo");
const { cloudinary } = require("../../configs/cloudinary");
const axios = require("axios");
const Commando = require("discord.js-commando");
const guildEmote = require("../../models/guildEmote");
const Discord = require("discord.js");
const { ErrorEmbed } = require("../../utils/embed");
const { nanoid } = require("nanoid");

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
          prompt: "Enter emote link.",
          type: "string",
          default: "",
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

    let { name, url } = args;

    if (!url) {
      const attachment = message.attachments.first();
      if (!attachment)
        return ErrorEmbed("You need to provide emote url or file.", channel);
      url = attachment.url;
      name = attachment.name.split(".")[0];
      if (!url)
        return ErrorEmbed(
          "Something went wrong, please try again later.",
          channel
        );
    }

    const urlType = validateUrl(url);

    if (urlType === 0) return ErrorEmbed("Invalid emote url.", channel);
    else if (urlType === 1) {
      if (!name) return ErrorEmbed("Provide an alias for the emote.", channel);
      const uploadResponse = await cloudinary.uploader.upload(url, {
        upload_preset: "udility",
      });

      if (!uploadResponse)
        return ErrorEmbed(
          "Something went wrong, please try again later.",
          channel
        );

      const { url: ImageUrl, format } = uploadResponse;

      if (!url || !format)
        return ErrorEmbed(
          "Something went wrong, please try again later.",
          channel
        );

      const emote = {
        id: nanoid(10),
        url: addPresetToUrl(ImageUrl),
        type: format,
        alias: name,
      };

      addEmoteToDb(guild.id, emote, channel, prefix);
    } else if (urlType === 2) {
      const emote = await fetchBttvEmote(url, name);
      if (!emote) return ErrorEmbed("Could not fetch emote.", channel);
      addEmoteToDb(guild.id, emote, channel, prefix);
    }
  }
};

//helper functions
const validateUrl = (url) => {
  const urlregex =
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  if (urlregex.test(url)) {
    if (url.match(/\.(jpeg|jpg|gif|png)$/)) return 1;
    else if (url.includes("betterttv.com/emotes")) return 2;
    else return 0;
  }
  return 0;
};

const fetchBttvEmote = async (url, name) => {
  const emoteID = url.split("/").pop();
  try {
    const { data } = await axios.get(
      `https://api.betterttv.net/3/emotes/${emoteID}`
    );
    const { imageType, code } = data;

    if (!imageType || !code) return null;

    return {
      id: emoteID,
      url: `https://cdn.betterttv.net/emote/${emoteID}/3x${
        imageType === "gif" ? ".gif" : ""
      }`,
      type: imageType,
      alias: name ? name : code,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const addEmoteToDb = async (guildID, emote, channel, prefix) => {
  try {
    await mongo().then(async (mongoose) => {
      const isAliasExist = await guildEmote.findOne(
        { guild: guildID },
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
        { guild: guildID },
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
        { guild: guildID },
        { $push: { emotes: emote } },
        {
          upsert: true,
          new: true,
        }
      );

      if (!addEmote)
        return ErrorEmbed(
          `Something went wrong, please try again later`,
          channel
        );
      const embed = new Discord.MessageEmbed()
        .setTitle("New Emote Added ✅ ")
        .setDescription(
          `\**Alias\**:${emote.alias}\nUse \`${prefix}emote ${emote.alias}\``
        )
        .setImage(emote.url);
      channel.send(embed);
    });
  } catch (error) {
    console.error(error);
    return ErrorEmbed(`Something went wrong, please try again later`, channel);
  }
};

const addPresetToUrl = (url) => {
  const urlArr = url.split("/");
  urlArr.splice(urlArr.indexOf("upload") + 1, 0, "w_112,h_112");
  return urlArr.join("/");
};
