const Commando = require("discord.js-commando");
const { CacheGet, CacheSetex } = require("../../functions/cache");

const { RedditEmbed } = require("../../functions/embed");
const Reddit = require("../../libs/reddit");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "meme",
      group: "fun",
      memberName: "meme",
      description: "Get random post from a subreddit.",
      args: [
        {
          key: "subreddit",
          prompt: "Please specify a subreddit.",
          type: "string",
          default: "meme",
        },
      ],
    });
  }
  async run(message, args) {
    let subreddit = args.subreddit;

    let posts = await CacheGet(`Rd-${subreddit}`, true);
    if (!posts) {
      const reddit = new Reddit(subreddit, "hot");
      posts = await reddit.getPosts(subreddit, 100);
      if (posts) CacheSetex(`Rd-${subreddit}`, 3600, posts);
    }

    if (!posts)
      return message.reply(`could not fetch posts from \`r/${subreddit}\`.`);

    const post = posts[Math.floor(Math.random() * posts.length)];

    let Embed;

    if (post.is_video) {
      Embed = RedditEmbed(post, "video");
      if (!Embed)
        return message.reply("Something went wrong.Please try again later.");
      message.channel.send(Embed);
      message.channel.send(post.media);
    } else {
      Embed = RedditEmbed(post);
      if (!Embed)
        return message.reply("Something went wrong.Please try again later.");
      message.channel.send(Embed);
    }
  }
};
