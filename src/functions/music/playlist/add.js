const mongo = require("../../../mongo");
const playlistSchema = require("../../../schemas/playlistSchema");
const cache = require("../../cache");
const musicPlayerInstance = require("../musicPlayerInstance");
module.exports = async (id, playlist, channel) => {
  let resp;
  await mongo().then(async (mongoose) => {
    try {
      resp = await playlistSchema.findOneAndUpdate(
        {
          user: id,
        },

        {
          user: id,

          $push: { playlist },
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
    let musicPlayer = musicPlayerInstance(channel);
    if (musicPlayer) {
      const plst = cache.get(`Playlist-${id}`);
      musicPlayer.flushcache();
      musicPlayer.addplaylist(plst);
      if (musicPlayer.isShuffled === true) {
        musicPlayer.shufflePlaylist();
      }
    }
    return true;
  }
  return false;
};
