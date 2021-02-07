const { Readable } = require("stream");

const WitSpeech = require("node-witai-speech");
module.exports = async (buffer, channel, username) => {
  var stream = Readable.from(buffer);
  const content_type =
    "audio/raw;encoding=signed-integer;bits=16;rate=48k;endian=little";
  var parseSpeech = new Promise((ressolve, reject) => {
    // call the wit.ai api with the created stream
    WitSpeech.extractSpeechIntent(
      "4TCQAAXIC7TOMH63766OLXQOM63XMQJP",
      stream,
      content_type,
      (err, res) => {
        if (err) return reject(err);
        ressolve(res);
      }
    );
  });

  // check in the promise for the completion of call to witai
  parseSpeech
    .then((data) => {
      console.log(data);
      let text = data.text;
      channel.send(`${username}:${text}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
