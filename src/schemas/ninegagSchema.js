const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const ninegagSchema = mongoose.Schema({
  _id: reqString,
  guild: reqString,
  channel: reqString,
  interval: reqString,
  active: { type: Boolean, default: false },
});

module.exports = mongoose.model("gag-channels", ninegagSchema);
