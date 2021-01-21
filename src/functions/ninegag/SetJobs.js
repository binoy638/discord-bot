const NineGag = require("./ninegag");
const sendgag = require("./sendgag");
var job = require("../JobManager");
var cache = require("../cache");

module.exports = async (section, interval, channel) => {
  const nineGagObject = new NineGag(section);
  const JobId = `job-${channel.id}`;
  const time = `0 */${interval} * * * *`;
  // const time = `*/${interval} * * * * *`;
  const taskfunction = async () => {
    let resp = await nineGagObject.getRandomPost(20);
    const id = resp["id"];

    const isRepeated = (newid) => {
      if (SentPosts.size >= 200) {
        SentPosts.clear();
        cache.set(`SublistPosts-${channel.id}`, SentPosts);
      }
      if (SentPosts.has(newid)) {
        (async () => {
          resp = await nineGagObject.getRandomPost(20);
          isRepeated(resp["id"]);
        })();
      } else {
        SentPosts.add(newid);
        cache.set(`SublistPosts-${channel.id}`, SentPosts);
        console.log(cache.get(`SublistPosts-${channel.id}`));
        return sendgag(resp, channel);
      }
    };
    let SentPosts = cache.get(`SublistPosts-${channel.id}`);
    if (!SentPosts) {
      let set = new Set();
      set.add(id);
      cache.set(`SublistPosts-${channel.id}`, set);

      sendgag(resp, channel);
    } else {
      isRepeated(id);
    }
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
