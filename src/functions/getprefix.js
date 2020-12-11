const mongo = require("../mongo");
const prefixSchema = require("../schemas/prefixSchema");

module.exports = async (guild_id) => {
  let data = null;
  await mongo().then(async (mongoose) => {
    try {
      const result = await prefixSchema.findOne(
        { _id: guild_id },
        (err, user) => {
          if (err) {
            console.log("error");
            return;
          }
          if (user) {
            data = user.prefix;
          } else {
            return;
          }
        }
      );

      //   if (result) {
      //     console.log("PREFIX FETCHED FROM DATABASE");
      //     data = result.prefix;
      //   }
    } catch (e) {
      console.log("error");
    } finally {
      mongoose.connection.close();
    }
  });
  return data;
};
