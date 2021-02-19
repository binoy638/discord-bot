const mongo = require("../../../mongo");
const playlistSchema = require("../../../schemas/playlistSchema");
const cache = require("../../cache");

module.exports = async (id) => {
  await mongo().then(async (mongoose) => {
    try {
      await playlistSchema.findOneAndRemove({
        user: id,
      });
      cache.del(`Playlist-${id}`);
    } catch (e) {
      console.log(e);
    } finally {
      mongoose.connection.close();
    }
  });
};
