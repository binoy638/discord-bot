const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const valoschema = mongoose.Schema({
  _id: reqString,
  valo_user: reqString,
  valo_tag: reqString,
});

module.exports = mongoose.model("valo-user-ids", valoschema);
