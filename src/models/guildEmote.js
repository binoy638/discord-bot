const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const guildEmotesSchema = mongoose.Schema({
  guild: reqString,
  emotes: [],
});

module.exports = mongoose.model("guild-emotes", guildEmotesSchema);
