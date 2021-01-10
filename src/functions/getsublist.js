const mongo = require("../mongo");
const nineSchema = require("../schemas/ninegagSchema");
var cache = require("./cache");
module.exports = async () => {
  let data = [];
  await mongo().then(async (mongoose) => {
    try {
      const arr = await nineSchema.find({ active: true });
      data = arr;
      return arr;
    } catch (e) {
      console.log(e);
    } finally {
      mongoose.connection.close();
    }
  });
  return data;
};
