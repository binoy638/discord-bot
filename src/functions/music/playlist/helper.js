const mongo = require("../../../mongo");
const playlistSchema = require("../../../schemas/playlistSchema");
const cache = require("../../cache");
const musicPlayerInstance = require("../musicPlayerInstance");

const add = async (id, playlist, channel) => {
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

const clear = async (id, channel) => {
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

const find = async (id) => {
  const playlist = await mongo().then(async (mongoose) => {
    try {
      const data = await playlistSchema.findOne({
        user: id,
      });

      if (data) {
        return data.playlist;
      } else {
        return null;
      }
    } finally {
      mongoose.connection.close();
    }
  });
  return playlist;
};

const remove = async (id, track, channel) => {
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

const addplayerInfo = async (id, trackInfo) => {
  await mongo().then(async (mongoose) => {
    try {
      await playlistSchema.updateOne(
        {
          user: id,
          "playlist.track": trackInfo.track,
          "playlist.artists": trackInfo.artists,
        },
        {
          $set: {
            "playlist.$.playerInfo": trackInfo.playerInfo,
          },
        }
      );
    } finally {
      mongoose.connection.close();
    }
  });
};

module.exports = { add, clear, find, remove, addplayerInfo };
