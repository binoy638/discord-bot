const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const playlistSchema = mongoose.Schema({
  user: reqString,
  playlist: [],
});

module.exports = mongoose.model("user-playlists", playlistSchema);
