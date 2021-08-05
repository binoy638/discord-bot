const { agenda } = require("../../configs/agenda");
const mongoose = require("mongoose");
const animeTimer = require("./animeTimer");

const extractIDIndex = (embed) => {
  if (!embed) return undefined;
  const footerText = embed?.footer?.text;
  if (!footerText) return undefined;

  const strArr = footerText.split(" ");

  const ID = strArr[strArr.indexOf("ID:") + 1];
  const Index = strArr[strArr.indexOf("Index:") + 1];

  if (!ID || !Index) return undefined;

  return [ID, Index];
};

const retryJob = async (id, attempts, client) => {
  const jobs = await agenda.jobs({
    _id: mongoose.Types.ObjectId(id),
  });
  if (jobs.length === 0) return;
  const job = jobs[0];
  console.log(`Trying to fetch anime for job id: ${id}\nAttempt: ${attempts}`);
  const { channelID, animeID, animeImage, animeTitle, animeDay, animeTime } =
    job.attrs.data;

  const channel = client.channels.cache.get(channelID);
  const isDone = await animeTimer(
    {
      id: animeID,
      image: animeImage,
      title: animeTitle,
      Day: animeDay,
      Time: animeTime,
    },
    channel
  );
  return isDone;
};

module.exports = { extractIDIndex, retryJob };
