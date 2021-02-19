const mongo = require("../../../mongo");
const playlistSchema = require("../../../schemas/playlistSchema");
const cache = require("../../cache");
module.exports = async (id, track) => {
  let resp;
  await mongo().then(async (mongoose) => {
    try {
      resp = await playlistSchema.findOneAndUpdate(
        {
          user: id,
        },

        {
          user: id,

          $pull: { playlist: track },
        },
        {
          upsert: true,
          new: true,
        }
      );
      const newPlaylist = resp.playlist;

      cache.set(`Playlist-${id}`, newPlaylist);
    } catch (e) {
      return false;
    } finally {
      mongoose.connection.close();
    }
  });

  if (resp) {
    return true;
  }
  return false;
};
