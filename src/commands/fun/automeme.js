const Commando = require("discord.js-commando");
const cache = require("../../functions/cache");
const mongo = require("../../mongo");
const redditSchema = require("../../models/reddit");
const { RedditEmbed } = require("../../functions/embed");
const { fetchHotPosts } = require("../../functions/reddit/snoowrap");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "automeme",
      group: "fun",
      memberName: "automeme",
      ownerOnly: true,
      description:
        "Let udility post memes automatically from a subreddit after a set interval.",
      args: [
        {
          key: "subreddit",
          prompt: "Enter subreddit name.",
          type: "string",
        },
        {
          key: "interval",
          prompt: "Please enter the time interval(in mins) between each posts.",
          type: "integer",
          max: 59,
          min: 1,
        },
      ],
    });
  }
  async run(message, args) {
    const { channel } = message;
    const subreddit = args.subreddit;
    const interval = args.interval;

    const isValid = await fetchHotPosts(subreddit, 10);

    if (!isValid)
      return message.reply(
        `\`r/${subreddit}\` is not a valid subreddit, please try again.`
      );

    await mongo().then(async (mongoose) => {
      try {
        await redditSchema.findOneAndUpdate(
          {
            channel: channel.id,
          },
          {
            channel: channel.id,
            guild: channel.guild.id,
            section: subreddit,
            interval,
            active: true,
          },
          {
            upsert: true,
          }
        );
      } catch (e) {
        console.log("not found");
      } finally {
        mongoose.connection.close();
      }
    });

    message.reply(
      `Automeme activated \nPosting from \`r/${subreddit}\` every \`${interval}\` mins in this channel.`
    );

    // let posts = cache.get(`Rd-${subreddit}`);
    // if (!posts) {
    //   posts = await fetchHotPosts(subreddit, 50);
    //   if (posts) cache.set(`Rd-${subreddit}`, posts, 120);
    // }

    // if (!posts)
    //   return message.reply(`could not fetch posts from \`r/${subreddit}\`.`);

    // const post = posts[Math.floor(Math.random() * posts.length)];

    // let Embed;

    // if (post.is_video) {
    //   Embed = RedditEmbed(post, "video");
    //   if (!Embed)
    //     return message.reply("Something went wrong.Please try again later.");
    //   message.channel.send(Embed);
    //   message.channel.send(post.media);
    // } else {
    //   Embed = RedditEmbed(post);
    //   if (!Embed)
    //     return message.reply("Something went wrong.Please try again later.");
    //   message.channel.send(Embed);
    // }
    // job(subreddit, interval, channel);
  }
};
