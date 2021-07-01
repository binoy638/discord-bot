const mongo = require("../../configs/mongo");
const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const guildEmote = require("../../models/guildEmote");
const { ErrorEmbed } = require("../../utils/embed");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "emote_show",
      group: "guild",
      memberName: "emote_show",
      description: "Show available emotes in this guild.",
    });
  }
  async run(message) {
    const { channel, guild } = message;

    try {
      await mongo().then(async (mongoose) => {
        const emotesObj = await guildEmote.findOne({ guild: guild.id });
        if (!emotesObj) return ErrorEmbed("No emotes available.", channel);
        const { emotes } = emotesObj;
        if (emotes) {
          const embed = new Discord.MessageEmbed()
            .setTitle("Avaiable Emotes")
            .setDescription(`${emotes.map((em) => em.alias)}`);
          channel.send(embed);
        } else ErrorEmbed("No emotes available.", channel);
      });
    } catch (error) {
      console.error(error);
    }
  }
};
