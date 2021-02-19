const mongo = require("../../mongo");
const playlistSchema = require("../../schemas/playlistSchema");
const cache = require("../cache");

module.exports = async (id, trackInfo) => {
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

      console.log("added playlist info");
    } finally {
      mongoose.connection.close();
    }
  });
};
