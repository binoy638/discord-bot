const axios = require("axios");
const Discord = require("discord.js");
const animeButtons = require("../../buttons/animeButtons");
const { agenda } = require("../../configs/agenda");
const { baseUrl } = require("../../configs/api");
const { CacheGet, CacheSetex } = require("../cache");

module.exports = async (JobInfo, channel) => {
  const { id, image, title, Day, Time } = JobInfo;

  try {
    const { data } = await axios.get(`${baseUrl}/anime/episode?q=${title}`);
    if (data?.episode.length === 0) return false;
    const episodes = extractEpisodes(data.episode);

    const description = data.episode[0].title || title;

    const embed = new Discord.MessageEmbed()
      .setTitle(`New Episode of ${title} is out`)
      .setDescription(description)
      .setImage(image)
      .setFooter(`Next episode will be out on ${Day} at ${Time}(IST)`);
    const buttons = animeButtons(
      episodes["480p"] || null,
      episodes["720p"] || null,
      episodes["1080p"] || null
    );
    if (channel) {
      channel.send({ embed, components: buttons });
    } else {
      console.log("no channel found");
      console.log(episodes);
    }

    return true;
  } catch (error) {
    console.log("could not fetch anime");
    console.error(error);
    let isAiring = await CacheGet(`isAiring:${id}`);
    if (isAiring === undefined) {
      const {
        data: { airing },
      } = await axios.get(`https://api.jikan.moe/v3/anime/${id}`);
      isAiring = airing;
      CacheSetex(`isAiring:${id}`, 7200, isAiring);
    }

    if (airing === "false") {
      const removedJobCount = await agenda.cancel({
        name: "animeTimer",
        "data.animeID": id,
      });
      console.log(
        `Anime ${id} have stopped airing.\nJob cancelled: ${removedJobCount}`
      );
      return true;
    } else {
      return false;
    }
  }
};

const extractEpisodes = (arr) => {
  return arr.reduce((acc, curr) => {
    acc[curr.quality] = curr.slug;
    return acc;
  }, {});
};
