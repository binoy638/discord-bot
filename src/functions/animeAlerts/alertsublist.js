const mongo = require("../../mongo");
const animeAlertSchema = require("../../schemas/animeAlertSchema");

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
