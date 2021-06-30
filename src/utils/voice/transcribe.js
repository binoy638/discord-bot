const { Readable } = require("stream");
const API_KEY = process.env.WITAI_KEY;
const WitSpeech = require("node-witai-speech");
const extractIntent = require("./extractIntent");
module.exports = async (buffer, message, client) => {
  var stream = Readable.from(buffer);
  const content_type =
    "audio/raw;encoding=signed-integer;bits=16;rate=48k;endian=little";
  var parseSpeech = new Promise((ressolve, reject) => {
    // call the wit.ai api with the created stream
    WitSpeech.extractSpeechIntent(API_KEY, stream, content_type, (err, res) => {
      if (err) return reject(err);
      ressolve(res);
    });
  });

  // check in the promise for the completion of call to witai
  parseSpeech
    .then((data) => {
      // console.log(data);
      extractIntent(data, message, client);
    })
    .catch((err) => {
      console.log(err);
    });
};
