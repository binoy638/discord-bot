const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const ninegagSchema = mongoose.Schema({
  _id: reqString,
  channel: reqString,
  interval: reqString,
});

module.exports = mongoose.model("gag-channels", ninegagSchema);
