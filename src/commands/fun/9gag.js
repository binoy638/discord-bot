const NineGag = require("../../functions/ninegag/ninegag");
var cache = require("../../functions/cache");
const sendgag = require("../../functions/ninegag/sendgag");
const Commando = require("discord.js-commando");

module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "9gag",
      group: "fun",
      memberName: "9gag",
      description: "Get a meme from a specific 9gag section",
    });
  }
  async run(message, args) {
    const { channel } = message;
    const section = args;
    const PostFetchIteration = 5;
    const PostListCount = 9 + PostFetchIteration * 10;

    const nineGagObject = new NineGag(section);

    const status = await nineGagObject.isSectionValid();
    if (status === false) {
      return message.channel.send(
        `Sorry, I can't find a \`${args[0]}\` section in 9gags.`
      );
    }

    let resp = await nineGagObject.getRandomPost(PostFetchIteration);

    const id = resp["id"];

    const isRepeated = (newid) => {
      if (SentPosts.size >= PostListCount) {
        SentPosts.clear();
        cache.set(`SentPosts-${channel.id}`, SentPosts);
      }
      if (SentPosts.has(newid) || resp["type"] == "Article") {
        (async () => {
          resp = await nineGagObject.getRandomPost(PostFetchIteration);
          isRepeated(resp["id"]);
        })();
      } else {
        SentPosts.add(newid);
        cache.set(`SentPosts-${channel.id}`, SentPosts);

        return sendgag(resp, channel);
      }
    };

    let SentPosts = cache.get(`SentPosts-${channel.id}`);

    if (!SentPosts) {
      let set = new Set();
      set.add(id);
      cache.set(`SentPosts-${channel.id}`, set);

      return sendgag(resp, channel);
    } else {
      isRepeated(id);
    }
  }
};
