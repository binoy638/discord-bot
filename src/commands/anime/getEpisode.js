const axios = require("axios");
const Discord = require("discord.js");
const Commando = require("discord.js-commando");
const animeButtons = require("../../buttons/animeButtons");
const { ErrorEmbed } = require("../../utils/embed");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "episode",
      aliases: ["ep", "ani_ep"],
      group: "anime",
      memberName: "ani_ep",
      description: "Get the last released episode of an anime.",
      args: [
        {
          key: "animeID",
          prompt: "Please enter the ID of the anime u want the episode of.",
          type: "integer",
        },
      ],
    });
  }
  async run(message, args) {
    let id = args.animeID;
    try {
      const { data: anime } = await axios.get(
        `https://udility.herokuapp.com/anime_first/${id}`
      );
      if (!anime) return ErrorEmbed("Episode not found!", message.channel);

      const {
        data: { image_url },
      } = await axios.get(`https://api.jikan.moe/v3/anime/${id}`);

      if (image_url) anime.image_url = image_url;
      const buttons = animeButtons(anime["480"], anime["720"], anime["1080"]);
      const embed = new Discord.MessageEmbed()
        .setTitle(`New Episode of ${anime.title} is out`)
        .setDescription(anime.episode)
        .setImage(image_url)
        .setFooter(
          `Next episode will be out on ${anime.day} at ${anime.IST}(IST)`
        );
      message.channel.send({ embed, components: buttons });
    } catch (error) {
      ErrorEmbed("Episode not found!", message.channel);
      console.error(error);
    }
  }
};
