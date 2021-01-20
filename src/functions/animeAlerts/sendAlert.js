const Discord = require("discord.js");
module.exports = (data, channel, isfirst) => {
  let {
    480: res480,
    720: res720,
    1080: res1080,
    IST: IST,
    day: day,
    episode: episode,
    title: title,
    anime_id: id,
  } = data;
  const alert = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`${title}-${episode}`)
    .setURL(`https://myanimelist.net/${id}`)
    .addFields(
      {
        name: "480p",
        value: `[Open](https://udility.herokuapp.com/redirect/${res480})`,
        inline: true,
      },
      {
        name: "720p",
        value: `[Open](https://udility.herokuapp.com/redirect/${res720})`,
        inline: true,
      },
      {
        name: "1080p",
        value: `[Open](https://udility.herokuapp.com/redirect/${res1080})`,
        inline: true,
      }
    );
  if (isfirst) {
    channel.send(`Next episode will be out on next \`${day} at ${IST}(IST)\``);
  } else {
    channel.send(
      `Yay! New epside of ${title} out.\nNext episode will be out on next \`${day} at ${IST}(IST)\``
    );
  }
  channel.send(alert);
};
