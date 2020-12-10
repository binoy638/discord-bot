const mongo = require("../mongo");
const welcomeSchema = require("../schemas/welcome-schema");
const cache = {};

module.exports = async (member) => {
  const { guild } = member;

  let data = cache[guild.id];

  //   console.log(`cache: ${JSON.stringify(demo)}`);
  if (data) {
    console.log("FETCHING FROM CACHE MEMORY");
  }
  if (!data) {
    console.log("FETCHING FROM DATABASE");
    await mongo().then(async (mongoose) => {
      try {
        const result = await welcomeSchema.findOne({ _id: guild.id });
        cache[guild.id] = data = [result.channelId, result.text];
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
