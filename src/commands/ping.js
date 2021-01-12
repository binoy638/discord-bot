const nineSchema = require("../schemas/ninegagSchema");
const mongo = require("../mongo");
// var exports = require("../bot");
// var CronJobManager = require("cron-job-manager");
// var manager = new CronJobManager();
var job = require("../functions/JobManager");
module.exports = {
  name: "ping",
  description: "Ping!",
  active: false,
  async execute(message, args) {
    // manager = exports.manager;
    // console.log(manager);
    job.add("key", "* 30 * * * *", () => {
      console.log("listen carefully.. I will say this only once!");
    });
    console.log(job.exists("key"));
    console.log(job.exists("keys"));
    job.show();
    message.channel.send("hello");
  },
};
