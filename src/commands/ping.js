const nineSchema = require("../schemas/ninegagSchema");
const mongo = require("../mongo");
module.exports = {
  name: "ping",
  description: "Ping!",

  active: false,

  async execute(message, args) {
    await mongo().then(async (mongoose) => {
      try {
        const arr = await nineSchema.find({ active: true });
        console.log(arr);
      } catch (e) {
        console.log(e);
      } finally {
        mongoose.connection.close();
      }
    });
  },
};
