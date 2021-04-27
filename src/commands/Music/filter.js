const Commando = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");
const {
  Emoji2Filter,
  String2Filter,
} = require("../../functions/utils/filterOpts");
const applyFilter = require("../../functions/music/applyFilter");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "filter",
      group: "music",
      aliases: ["fl"],
      memberName: "filter",
      description: "Apply filters on the music player.",
      args: [
        {
          key: "type",
          prompt: "Which filter you want to apply?",
          type: "string",
          oneOf: [
            "nightcore",
            "bassboost",
            "8D",
            "vaporwave",
            "karaoke",
            "phaser",
            "tremolo",
            "desilencer",
            "surrounding",
            "pulsator",
            "chorus",
            "clear",
          ],
          default: "",
        },
      ],
    });
  }
  async run(message, args) {
    const { channel } = message;
    const prefix = message.guild._commandPrefix || "!";
    let connection = message.guild.me.voice.connection;

    if (!connection) {
      return channel.send(`No song is playing to apply filters.`);
    }
    let dispatcher = connection.dispatcher;
    if (!dispatcher) {
      return channel.send("No song is playing to apply filters");
    }
    const musicPlayer = musicPlayerInstance(message.channel);

    const filterType = args.type;

    if (!filterType) {
      const Embed = new MessageEmbed()
        .setTitle("Filters")
        .addFields(
          { name: "0️⃣ `nightcore`", value: "____________", inline: true },
          { name: "1️⃣ `bassboost`", value: "____________", inline: true },
          { name: "2️⃣ `8D`", value: "____________", inline: true },
          { name: "3️⃣ `vaporwave`", value: "____________", inline: true },
          {
            name: "4️⃣ `karaoke`",
            value: "____________",
            inline: true,
          },
          { name: "5️⃣ `phaser`", value: "____________", inline: true },
          { name: "6️⃣ `tremolo`", value: "____________", inline: true },
          {
            name: "7️⃣ `desilencer`",
            value: "____________",
            inline: true,
          },
          {
            name: "8️⃣ `surrounding`",
            value: "____________",
            inline: true,
          },
          {
            name: "9️⃣ `pulsator`",
            value: "____________",
            inline: true,
          },
          { name: "🔟 `chorus`", value: "____________", inline: true },
          { name: "❎ `clear`", value: "____________", inline: true }
        )
        .setFooter(
          `use reactions or ${prefix}filter [filter type] to apply filters`
        );
      const filterOptsMessage = await channel.send(Embed);
      await filterOptsMessage.react("0️⃣");
      await filterOptsMessage.react("1️⃣");
      await filterOptsMessage.react("2️⃣");
      await filterOptsMessage.react("3️⃣");
      await filterOptsMessage.react("4️⃣");
      await filterOptsMessage.react("5️⃣");
      await filterOptsMessage.react("6️⃣");
      await filterOptsMessage.react("7️⃣");
      await filterOptsMessage.react("8️⃣");
      await filterOptsMessage.react("9️⃣");
      await filterOptsMessage.react("🔟");
      await filterOptsMessage.react("❎");

      const filter = (reaction, user) => user.id !== this.client.user.id;
      let collector = filterOptsMessage.createReactionCollector(filter, {
        time: 600000,
      });
      // const seekTime = dispatcher.streamTime / 1000;
      collector.on("collect", (reaction, user) => {
        const emoji = reaction.emoji.name;

        if (dispatcher) {
          let filterArgs = Emoji2Filter[emoji];
          if (filterArgs !== undefined) {
            applyFilter(filterArgs, connection, channel, musicPlayer);
          } else {
            console.log("invalid reaction");
          }
        }
      });
    } else {
      let filterArgs = String2Filter[filterType];
      if (filterArgs) {
        applyFilter(filterArgs, connection, channel, musicPlayer);
        message.reply(`Filter applied: \`${filterType}\``);
      } else {
        message.reply("something went wrong, please try again later.");
      }
    }
  }
};
