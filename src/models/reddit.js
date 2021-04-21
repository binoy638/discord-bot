const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const redditSchema = mongoose.Schema({
  channel: reqString,
  guild: reqString,
  subreddit: reqString,
  interval: reqString,
  active: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("automeme-channels", redditSchema);
