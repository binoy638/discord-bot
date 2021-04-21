const request = require("request-promise");
const Discord = require("discord.js");
const cheerio = require("cheerio");
const mongo = require("../../mongo");
const valoSchema = require("../../models/valorant");
const Commando = require("discord.js-commando");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "valostats",
      group: "gaming",
      memberName: "valostats",
      description: "Check your valorant stats.",
    });
  }
  async run(message) {
    const prefix = message.guild._commandPrefix;
    const { member } = message;

    let data = null;

    await mongo().then(async (mongoose) => {
      try {
        const result = await valoSchema.findOne({ _id: member.user.id });

        if (result) {
          data = [result.valo_user, result.valo_tag];
        } else {
          return message.channel.send(
            `Your valorant account is not connected, ${message.author}!\nuse \`${prefix}setvalouser <username> <tag>\` to connect your valorant account.`
          );
        }
      } finally {
        mongoose.connection.close();
      }
    });
    if (data === null) {
      return;
    }

    const exampleEmbed = new Discord.MessageEmbed();
    exampleEmbed
      .setColor("#0099ff")
      .setTitle(`Fetching valorant stats for \`${data[0]}#${data[1]}\``);
    let firstmsg = await message.channel.send(exampleEmbed);

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
      const matches = $('span[class="matches"]').text().trim();
      const rank_kda = $('span[class="valorant-highlighted-stat__value"]')
        .text()
        .trim();
      const rank = rank_kda.slice(0, -4);
      const kda = rank_kda.slice(-4);
      const win_percent = $('span[title="Win %"]').next().text();
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
      const most_played_hero = $(".agent__name").eq(0).text();

      exampleEmbed

        .setTitle(`${player_name}`)
        .setAuthor(
          "Valorant Stats",
          "https://pbs.twimg.com/profile_images/1292005670934347776/Lm-l7Ldr_400x400.jpg"
        )

        .setThumbnail(`${rank_icon}`)
        .addFields(
          { name: "\u200B", value: "\u200B" },
          { name: "Rating", value: `\`${rank}\``, inline: true },
          { name: "KDA Ratio", value: `\`${kda}\``, inline: true },
          { name: "Matches", value: `\`${matches}\``, inline: true },
          { name: "Win %", value: `\`${win_percent}\``, inline: true },
          { name: "K/D Ratio", value: `\`${kd}\``, inline: true },
          { name: "First Blood", value: `\`${first_blood}\``, inline: true },

          {
            name: "Kills",
            value: `\`${kills}\``,
            inline: true,
          },
          { name: "Deaths", value: `\`${deaths}\``, inline: true },
          { name: "Assists", value: `\`${Assists}\``, inline: true },
          { name: "Most Kills", value: `\`${most_kills}\``, inline: true },
          { name: "Headshots", value: `\`${headshot}\``, inline: true },
          {
            name: "Headshots %",
            value: `\`${headshot_percent}%\``,
            inline: true,
          },
          { name: "Aces", value: `\`${Aces}\``, inline: true },
          { name: "Clutches", value: `\`${Clutches}\``, inline: true },
          { name: "Flawless", value: `\`${Flawless}\``, inline: true }
        )
        .addField("Most Played Hero", `\`${most_played_hero}\``);

      firstmsg.edit(exampleEmbed);
    } catch (e) {
      exampleEmbed.setTitle("Invaild Username/Tag or Private Profile");
      firstmsg.edit(exampleEmbed);
    }
  }
};
