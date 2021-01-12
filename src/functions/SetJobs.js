const NineGag = require("./ninegag");
const sendgag = require("./sendgag");
var job = require("./JobManager");

module.exports = async (section, interval, channel) => {
  const nineGagObject = new NineGag(section);
  const JobId = `job-${channel.id}`;
  const time = `0 */${interval} * * * *`;
  const taskfunction = async () => {
    let resp = await nineGagObject.getRandomPost(5);
    sendgag(resp, channel);
  };

  if (job.exists(JobId)) {
    job.update(JobId, time, taskfunction);
    job.start(JobId);
    console.log(`${JobId} Started`);
    // job.show();
  } else {
    job.add(JobId, time, taskfunction);
    job.start(JobId);
    // job.show();
    console.log(`${JobId} Started`);
  }
};
