const Discord = require("discord.js");
const pagination = require("../../utils/pagination");
module.exports = (playlist, channel, username, prefix) => {
  const totaltracks = playlist.length;
  const page = args.page;
  const index = args.page - 1;
  const tracks = pagination(playlist, page, 10);
  const maxpages = Math.ceil(totaltracks / 10);

  const Embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle(`${username}'s Playlist`)
    .setDescription(`Total tracks:\`${totaltracks}\``);

  if (tracks.length === 0) {
    Embed.addField(
      "You have reach the end of the list.",
      `use ${prefix}showplaylist to go to the beginning.`
    );
  } else {
    tracks.map((item, i) =>
      Embed.addField(`${i + index * 10 + 1}. ${item.track}`, `${item.artists}`)
    );
  }
  if (maxpages > page) {
    Embed.setFooter(
      `Use ${prefix}showplaylist ${page + 1} to view next tracks.`
    );
  }

  message.channel.send(Embed);
};
