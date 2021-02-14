const job = require("../../functions/ninegag/SetJobs");
// const NineGag = require("../../functions/ninegag/ninegag");
const mongo = require("../../mongo");
const nineSchema = require("../../schemas/ninegagSchema");

const Commando = require("discord.js-commando");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "autoposts",
      group: "fun",
      memberName: "autoposts",
      description: "Automated posts from a 9GAG section.",
      args: [
        {
          key: "section",
          prompt: "Please enter a 9GAG section.",
          type: "string",
          oneOf: [
            "meme",
            "funny",
            "nsfw",
            "random",
            "anime-manga",
            "gaming",
            "gif",
            "savage",
            "superhero",
            "music",
            "science-tech",
            "sport",
            "travel-photography",
            "wholesome",
            "darkhumor",
          ],
        },
        {
          key: "interval",
          prompt: "Please enter the time interval(in mins) between each posts.",
          type: "integer",
          max: 59,
          min: 1,
        },
      ],
      userPermissions: ["ADMINISTRATOR"],
    });
  }
  async run(message, args) {
    console.log(args);
    const { channel } = message;

    const section = args.section;
    const interval = args.interval;

    // const nineGagObject = new NineGag(section);
    // const status = await nineGagObject.isSectionValid();
    // if (status === false) {
    //   return message.channel.send(
    //     `Sorry, I can't find a \`${args[0]}\` section in 9gag.`
    //   );
    // }
    await mongo().then(async (mongoose) => {
      try {
        await nineSchema.findOneAndUpdate(
          {
            _channel: channel.id,
          },
          {
            _channel: channel.id,
            section,
            interval,
            active: true,
          },
          {
            upsert: true,
          }
        );
      } catch (e) {
        console.log("not found");
        // cache.clear();
      } finally {
        mongoose.connection.close();
      }
    });

    message.channel.send(
      `\`Autoposting from 9gag(${section}) every ${interval} mins in this channel.\``
    );
    job(section, interval, channel);
  }
};
