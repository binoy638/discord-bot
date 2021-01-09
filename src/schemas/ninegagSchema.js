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
<<<<<<< HEAD
  active: { type: Boolean, default: false },
=======
  active: {
    type: Boolean,
    default: false,
  },
>>>>>>> devlopment
});

module.exports = mongoose.model("gag-channels", ninegagSchema);
