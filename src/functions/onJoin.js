const mongo = require("../mongo");
const welcomeSchema = require("../schemas/welcome-schema");
// const cache = {};
var cache = require("./cache");

module.exports = async (member) => {
  const { guild } = member;

  let data = cache.get(`welmsg${guild.id}`);

  //   console.log(`cache: ${JSON.stringify(demo)}`);

  if (!data) {
    await mongo().then(async (mongoose) => {
      try {
        const result = await welcomeSchema.findOne({
          _id: `welmsg${guild.id}`,
        });
        data = [result.channelId, result.text];
        cache.set(`welmsg${guild.id}`, data);
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
