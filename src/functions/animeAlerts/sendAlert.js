const Discord = require("discord.js");
var job = require("../JobManager");
const mongo = require("../../configs/mongo");
const animeAlertSchema = require("../../models/anime");
const animeButtons = require("../../buttons/animeButtons");
const axios = require("axios");
module.exports = async (data, channel, isfirst) => {
  let {
    480: res480,
    720: res720,
    1080: res1080,
    IST: IST,
    IST_Day: day,
    episode: episode,
    title: title,
    anime_id: id,
  } = data;
  const {
    data: { image_url },
  } = await axios.get(`https://api.jikan.moe/v3/anime/${id}`);
  const embed = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`New Episode of ${title} is out`)
    .setDescription(episode)
    .setImage(image_url)
    .setFooter(`Next episode will be out on ${day} at ${IST}(IST)`);

  const buttons = animeButtons(res480, res720, res1080);

  channel.send({ embed, components: buttons });
  if (!data["Airing"]) {
    channel.send(`This was the last episode of ${title} :(`);
    await mongo().then(async (mongoose) => {
      try {
        await animeAlertSchema.findOneAndDelete({
          _id: `${channel.id}-${id}`,
        });

        job.delete(`Alerts-${channel.id}-${id}`);
        console.log(`Alerts-${channel.id}-${id} Deleted`);
      } catch (e) {
        console.log("not found");
      } finally {
        mongoose.connection.close();
      }
    });
  }
};
