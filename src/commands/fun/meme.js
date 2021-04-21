const Commando = require("discord.js-commando");
const cache = require("../../functions/cache");
const { RedditEmbed } = require("../../functions/embed");
const { fetchHotPosts } = require("../../functions/reddit/snoowrap");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "meme",
      group: "fun",
      memberName: "meme",
      description: "Get a random meme from a reddit",
      args: [
        {
          key: "subreddit",
          prompt: "Enter subreddit name or url.",
          type: "string",
          default: "meme",
        },
      ],
    });
  }
  async run(message, args) {
    let subreddit = args.subreddit;

    let posts = cache.get(`Rd-${subreddit}`);
    if (!posts) {
      posts = await fetchHotPosts(subreddit, 50);
      if (posts) cache.set(`Rd-${subreddit}`, posts, 120);
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
