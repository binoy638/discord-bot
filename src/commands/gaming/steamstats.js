const request = require("request-promise");
const cheerio = require("cheerio");
const Discord = require("discord.js");
const Commando = require("discord.js-commando");
module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "steamtop",
      group: "gaming",
      memberName: "steamtop",
      description: "Get steam top games",
      args: [
        {
          key: "size",
          prompt: "How many games u want me to fetch?",
          type: "integer",
          min: 1,
          max: 25,
        },
      ],
    });
  }
  async run(message, args) {
    const gameCount = args.size;
    const Embed = new Discord.MessageEmbed()
      .setTitle(`Top ${gameCount} Steam games by current player count.`)
      .setURL("https://store.steampowered.com/stats/")
      .setThumbnail(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/768px-Steam_icon_logo.svg.png"
      );

    if (isNaN(gameCount)) {
      return message.channel.send("Invalid input.");
    }
    if (gameCount > 25) {
      return message.channel.send("Number of games can't be more than 25.");
    }
    const url = "https://store.steampowered.com/stats/";

    (async () => {
      try {
        const response = await request({
          uri: url,
          header: {
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
          },
          gzip: true,
        });
        const $ = cheerio.load(response);
        const gamedata = [];
        $("table tbody tr.player_count_row").each(function (i, element) {
          if (i === gameCount) return false;

          const tds = $(element).find("td");
          const current = $(tds[0]).text().trim();
          const peak = $(tds[1]).text().trim();
          const game = $(tds[3]).text().trim();
          // list.push(current.trim());
          const row = { game, current, peak };
          gamedata.push(row);
        });

        gamedata.map((data, i) =>
          Embed.addField(
            `${i + 1}. ${data.game}`,
            `Current Players: ${data.current} \nPeak Today: ${data.peak}`
          )
        );
        message.channel.send(Embed);
      } catch (e) {
        console.log("an error occured: ", e);
      }
    })();
  }
};
