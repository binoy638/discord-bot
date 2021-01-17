const NineGag = require("./ninegag");
const sendgag = require("./sendgag");
var job = require("./JobManager");
var cache = require("./cache");

module.exports = async (section, interval, channel) => {
  const nineGagObject = new NineGag(section);
  const JobId = `job-${channel.id}`;
  const time = `0 */${interval} * * * *`;
  // const time = `*/${interval} * * * * *`;
  const taskfunction = async () => {
    let resp = await nineGagObject.getRandomPost(20);
    const id = resp["id"];

    const isRepeated = (newid) => {
      if (SentPosts.length >= 10) {
        empty = [];
        cache.set("SublistPosts", empty);
        SentPosts = cache.get("SublistPosts");
      }
      if (SentPosts.indexOf(newid) == -1) {
        let newList = SentPosts;
        newList.push(newid);

        cache.set("SublistPosts", newList);

        sendgag(resp, channel);
      } else {
        (async () => {
          resp = await nineGagObject.getRandomPost(0);
          isRepeated(resp["id"]);
        })();
      }
    };
    let SentPosts = cache.get("SublistPosts");
    if (!SentPosts) {
      let list = [];
      list.push(id);
      cache.set("SublistPosts", list);

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
