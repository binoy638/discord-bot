const request = require("request-promise");
const Discord = require("discord.js");
const cheerio = require("cheerio");
const mongo = require("../mongo");
const valoSchema = require("../schemas/valorant-stats-schema");
var myprefix = require("../bot");

module.exports = {
  name: "vstats",
  aliases: ["val", "valo"],
  active: true,

  description: "Show valorant stats of connected account.",
  cooldown: 10,

  async execute(message, args) {
    // const acc_id = "Shiroyashaa98";
    // const tag = "NA1";

    const { member } = message;

    let data = null;

    await mongo().then(async (mongoose) => {
      try {
        const result = await valoSchema.findOne({ _id: member.user.id });

        if (result) {
          data = [result.valo_user, result.valo_tag];
        } else {
          return message.channel.send(
            `Your valorant account is not connected, ${message.author}!\nuse \`${myprefix.prefix}setvalouser <username> <tag>\` to connect your valorant account.`
          );
        }
      } finally {
        mongoose.connection.close();
      }
    });
    if (data === null) {
      return;
    }
    const url = `https://tracker.gg/valorant/profile/riot/${data[0]}%23${data[1]}/overview`;

    try {
      const response = await request({
        uri: url,
        header: {
          " accept": "image/webp,*/*",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US,en;q=0.5",
        },
        gzip: true,
      });
      const $ = cheerio.load(response);
      const player_name = $('span[class="trn-ign__username"]').text();
      const playtime = $('span[class="playtime"]').text().trim().slice(0, -9);
      const matches = $('span[class="matches"]').text().trim();
      const rank_kda = $('span[class="valorant-highlighted-stat__value"]')
        .text()
        .trim();
      const rank = rank_kda.slice(0, -4);
      const kda = rank_kda.slice(-4);
      const win = $(
        'div[class="valorant-winloss__stats"] > div:nth-child(1)'
      ).text();
      const win_percent = $(
        'div[class="valorant-winloss__stats"] > div:nth-child(2)'
      ).text();
      const lose = $(
        'div[class="valorant-winloss__stats"] > div:nth-child(3)'
      ).text();
      const kd = $('span[title="K/D Ratio"]').next().text();
      const headshot_percent = $('span[title="Headshots %"]').next().text();
      const kills = $('span[title="Kills"]').next().text();
      const headshot = $('span[title="Headshots"]').next().text();
      const deaths = $('span[title="Deaths"]').next().text();
      const Assists = $('span[title="Assists"]').next().text();
      const first_blood = $('span[title="First Bloods"]').next().text();
      const Aces = $('span[title="Aces"]').next().text();
      const Clutches = $('span[title="Clutches"]').next().text();
      const Flawless = $('span[title="Flawless"]').next().text();
      const most_kills = $('span[title="Most Kills (Match)"]').next().text();
      const rank_icon = $('img[class="valorant-rank-icon"]').attr("src");
      const most_played_hero_icon = $('img[class="agent__icon"]').attr("src");
      const most_played_hero = $(".agent__name").eq(0).text();

      //   imdbData.push({
      //     player_name,
      //     playtime,
      //     matches,
      //     rank,
      //     kda,
      //     win,
      //     win_percent,
      //     lose,
      //     kd,
      //     headshot_percent,
      //     kills,
      //     headshot,
      //     Assists,
      //     first_blood,
      //     Aces,
      //     Clutches,
      //     Flawless,
      //   });
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`${player_name}`)
        .setAuthor(
          "Valorant Stats",
          "https://pbs.twimg.com/profile_images/1292005670934347776/Lm-l7Ldr_400x400.jpg"
        )

        .setThumbnail(`${rank_icon}`)
        .addFields(
          { name: "Rating", value: `\`${rank}\``, inline: true },
          { name: "KDA Ratio", value: `\`${kda}\``, inline: true },
          { name: "Matches", value: `\`${matches}\``, inline: true },
          //   { name: "Play Time", value: `${playtime}`, inline: true },
          { name: "\u200B", value: "\u200B" },
          { name: "Wins", value: `\`${win}\``, inline: true },
          { name: "Lose", value: `\`${lose}\``, inline: true },
          { name: "Win %", value: `\`${win_percent}\``, inline: true },
          { name: "\u200B", value: "\u200B" },

          {
            name: "Kills",
            value: `\`${kills}\``,
            inline: true,
          },
          { name: "Deaths", value: `\`${deaths}\``, inline: true },
          { name: "Assists", value: `\`${Assists}\``, inline: true },
          { name: "\u200B", value: "\u200B" },
          { name: "Most Kills", value: `\`${most_kills}\``, inline: true },
          { name: "Headshots", value: `\`${headshot}\``, inline: true },
          {
            name: "Headshots %",
            value: `\`${headshot_percent}%\``,
            inline: true,
          },
          { name: "\u200B", value: "\u200B" },
          { name: "Aces", value: `\`${Aces}\``, inline: true },
          { name: "Clutches", value: `\`${Clutches}\``, inline: true },
          { name: "Flawless", value: `\`${Flawless}\``, inline: true },
          { name: "\u200B", value: "\u200B" }
        )
        .addField("Most Played Hero", `\`${most_played_hero}\``)
        .setImage(most_played_hero_icon);

      // .setTimestamp()
      // .setFooter("Some footer text here", "https://i.imgur.com/wSTFkRM.png");

      message.channel.send(exampleEmbed);

      //   message.channel.send(imdbData);
    } catch (e) {
      console.log("an error occured:", e);
      message.channel.send("Invaild Username/Tag or Private Profile");
    }
  },
};
