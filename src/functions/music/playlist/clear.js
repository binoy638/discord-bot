const mongo = require("../../../mongo");
const playlistSchema = require("../../../schemas/playlistSchema");

module.exports = async (id) => {
  await mongo().then(async (mongoose) => {
    try {
      await playlistSchema.findOneAndRemove({
        user: id,
      });
    } catch (e) {
      console.log(e);
    } finally {
      mongoose.connection.close();
    }
  });
};
