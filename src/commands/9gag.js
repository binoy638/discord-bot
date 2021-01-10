const NineGag = require("../functions/ninegag");
var cache = require("../functions/cache");
const sendgag = require("../functions/sendgag");
module.exports = {
  name: "9gag",
  description: "Random post from 9gags anime-manga section",
  usage: "<section name> \nExample: funny, meme, video, gaming, etc",
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
      if (SentPosts.length >= PostListCount) {
        cache.empty("SentPosts");
      }
      if (SentPosts.indexOf(newid) == -1) {
        SentPosts.push(newid);

        return sendgag(resp, channel);
      } else {
        (async () => {
          resp = await nineGagObject.getRandomPost(0);
          isRepeated(resp["id"]);
        })();
      }
    };

    const SentPosts = cache.get("SentPosts");

    if (!SentPosts) {
      let list = [];
      list.push(id);
      cache.set("SentPosts", list);

      return sendgag(resp, channel);
    } else {
      isRepeated(id);
    }
  },
};
