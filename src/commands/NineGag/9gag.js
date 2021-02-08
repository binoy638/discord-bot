const NineGag = require("../../functions/ninegag/ninegag");
var cache = require("../../functions/cache");
const sendgag = require("../../functions/ninegag/sendgag");
module.exports = {
  name: "9gag",
  description: "Random post from 9gags anime-manga section",
  category: "Memes",
  usage: "[section name]",
  active: true,
  args: true,
  args_limit: 1,

  async execute(message, args) {
    const { channel, guild } = message;
    const section = args[0];
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
  },
};
