const Commando = require("discord.js-commando");
const { agenda } = require("../../configs/agenda");
const { ErrorEmbed, SuccessEmbed } = require("../../utils/embed");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "stop",
      aliases: ["ani_stop"],
      group: "anime",
      memberName: "ani_stop",
      description: "Stop new episode release notification of an anime.",
      args: [
        {
          key: "animeID",
          prompt: "Please enter the ID of the anime.",
          type: "integer",
        },
      ],
    });
  }
  async run(message, args) {
    const { channel, guild } = message;
    const id = args.animeID;

    const isRemoved = await agenda.cancel({
      name: "animeTimer",
      "data.guildID": guild.id,
      "data.channelID": channel.id,
      "data.animeID": id,
    });

    if (isRemoved === 0) {
      ErrorEmbed("No matching anime notification found to disable.", channel);
    } else {
      SuccessEmbed(`Anime notification disabled for anime ID ${id}.`, channel);
    }
  }
};
