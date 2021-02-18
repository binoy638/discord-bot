const mongo = require("../../../mongo");
const playlistSchema = require("../../../schemas/playlistSchema");
const cache = require("../../cache");
module.exports = async (id, playlist) => {
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
