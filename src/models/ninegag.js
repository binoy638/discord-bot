const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const ninegagSchema = mongoose.Schema({
  channel: reqString,
  guild: reqString,
  section: reqString,
  interval: reqString,
  active: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("gag-channels", ninegagSchema);
