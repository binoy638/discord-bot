const mongo = require("../mongo");
const prefixSchema = require("../schemas/prefixSchema");

module.exports = async (guild_id) => {
  let data = null;
  await mongo().then(async (mongoose) => {
    try {
      await prefixSchema.findOne({ _id: guild_id }, (err, user) => {
        if (err) {
          console.log(err);
          return;
        }
        if (user) {
          data = user.prefix;
        } else {
          return;
        }
      });

      //   if (result) {
      //     console.log("PREFIX FETCHED FROM DATABASE");
      //     data = result.prefix;
      //   }
    } catch (e) {
      console.log("Prefix not found");
    } finally {
      mongoose.connection.close();
    }
  });
  return data;
};
