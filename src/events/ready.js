const getalertsublist = require("../functions/animeAlerts/alertsublist");
const alertjob = require("../functions/animeAlerts/setJobs");
const path = require("path");
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

    const alertsublist = await getalertsublist();
    alertsublist.map((obj) => {
      const channel = client.channels.cache.get(obj.channelId);
      alertjob(obj.anime_id, obj.anime_title, obj.cron_time, channel);
    });
  },
};
