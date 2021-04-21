const mongo = require("../../mongo");
const animeAlertSchema = require("../../models/anime");

module.exports = async () => {
  let data = [];
  await mongo().then(async (mongoose) => {
    try {
      const arr = await animeAlertSchema.find({ active: true });
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
