const mongo = require("../../../mongo");
const playlistSchema = require("../../../schemas/playlistSchema");
const cache = require("../../cache");
const musicPlayerInstance = require("../musicPlayerInstance");

module.exports = async (id, channel) => {
  await mongo().then(async (mongoose) => {
    try {
      await playlistSchema.findOneAndRemove({
        user: id,
      });
      cache.del(`Playlist-${id}`);
      musicPlayer = musicPlayerInstance(channel);
      musicPlayer.flushcache();
    } catch (e) {
      console.log(e);
    } finally {
      mongoose.connection.close();
    }
  });
};
