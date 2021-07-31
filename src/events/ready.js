const mongo = require("../configs/mongo");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`${client.user.username} is connected`);
    //waiting for database to connect

    await mongo().then((mongoose) => {
      try {
        console.log("Connected to mongo!");
      } finally {
        // closing database connection
        mongoose.connection.close();
      }
    });
  },
};
