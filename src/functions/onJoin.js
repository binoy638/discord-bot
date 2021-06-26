const mongo = require("../configs/mongo");
const welcomeSchema = require("../models/welcome");
const { CacheGet, CacheSet } = require("./cache");

module.exports = async (member) => {
  const { guild } = member;

  let data = await CacheGet(`welmsg${guild.id}`, true);

  if (!data) {
    await mongo().then(async (mongoose) => {
      try {
        const result = await welcomeSchema.findOne({
          _id: `welmsg${guild.id}`,
        });
        data = [result.channelId, result.text];
        CacheSet(`welmsg${guild.id}`, data);
      } finally {
        mongoose.connection.close();
      }
    });
  }
  const channelId = data[0];
  const text = data[1];
  const channel = guild.channels.cache.get(channelId);

  channel.send(`${text} <@${member.user.id}>`);
};
