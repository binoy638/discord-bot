var cache = require("../functions/cache");
var job = require("../functions/JobManager");
module.exports = {
  name: "ping",
  description: "Ping!",
  active: false,
  async execute(message, args) {
    job.add(
      "Test",
      "44 0 * * *",
      () => {
        console.log("hi");
      },
      {
        start: false,
        timeZone: "America/Los_Angeles",
      }
    );
    job.start("Test");
    job.show();
  },
};
