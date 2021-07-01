const axios = require("axios");
const Discord = require("discord.js");
const animeButtons = require("../../buttons/animeButtons");
const { agenda } = require("../../configs/agenda");
const { ErrorEmbed } = require("../embed");

module.exports = async (JobInfo, channel) => {
  const { id, image, title } = JobInfo;

  try {
    const { data: anime } = await axios.get(
      `https://udility.herokuapp.com/anime/${id}`
    );

    const {
      480: res480,
      720: res720,
      1080: res1080,
      IST,
      IST_Day: day,
      episode,
    } = anime;
    const embed = new Discord.MessageEmbed()
      .setTitle(`New Episode of ${title} is out`)
      .setDescription(episode)
      .setImage(image)
      .setFooter(`Next episode will be out on ${day} at ${IST}(IST)`);
    const buttons = animeButtons(res480, res720, res1080);
    channel.send({ embed, components: buttons });
  } catch (error) {
    if (error.response.status === 404) {
      const {
        data: { airing },
      } = await axios.get(`https://api.jikan.moe/v3/anime/${id}`);
      if (!airing) {
        const removedJobCount = await agenda.cancel({
          name: "animeTimer",
          "data.animeID": id,
        });
        return console.log(
          `Anime ${id} have stopped airing.\nJob cancelled: ${removedJobCount}`
        );
      } else {
        return ErrorEmbed(
          `${title}'s new episode got delayed.\nUse \`episode ${id}\` to get the last released episode.`,
          channel
        );
      }
    } else {
      console.error(error);
      ErrorEmbed(
        `Something went wrong,could not fetch episode.\nAnime ID:\`${id}\``,
        channel
      );
    }
  }
};
