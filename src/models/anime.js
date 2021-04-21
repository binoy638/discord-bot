const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const animeAlerts = mongoose.Schema({
  _id: reqString,
  channelId: reqString,
  guild: reqString,
  anime_id: reqString,
  cron_time: reqString,
  anime_title: reqString,
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("anime-alerts-sublist", animeAlerts);
