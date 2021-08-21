const mongo = require("../../../configs/mongo");
const playlistSchema = require("../../../models/playlist");

const add = async (id, playlist) => {
  return await mongo().then(async (mongoose) => {
    try {
      const resp = await playlistSchema.findOneAndUpdate(
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
      if (resp) return true;
      else return false;
    } catch (e) {
      return false;
    } finally {
      mongoose.connection.close();
    }
  });
};

const clear = async (id) => {
  return await mongo().then(async (mongoose) => {
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

const remove = async (id, track) => {
  return await mongo().then(async (mongoose) => {
    try {
      const resp = await playlistSchema.findOneAndUpdate(
        {
          user: id,
        },

        {
          user: id,

          $pull: { playlist: track },
        },
        {
          new: true,
        }
      );
      if (resp) return true;
      else return false;
    } catch (e) {
      return false;
    } finally {
      mongoose.connection.close();
    }
  });
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
