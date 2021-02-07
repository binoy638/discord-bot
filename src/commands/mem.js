var os = require("os");
module.exports = {
  name: "mem",
  description: "check memory usage",
  active: true,
  async execute(message, args) {
    const usage = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(usage);
  },
};
