const mongo = require("../../../mongo");
const playlistSchema = require("../../../schemas/playlistSchema");

module.exports = async (id) => {
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
