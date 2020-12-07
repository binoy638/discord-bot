const googleSpeech = require("@google-cloud/speech");

const googleSpeechClient = new googleSpeech.SpeechClient();
const { OpusEncoder } = require("@discordjs/opus");

const encoder = new OpusEncoder(48000, 2);

const { Transform } = require("stream");

function convertBufferTo1Channel(buffer) {
  const convertedBuffer = Buffer.alloc(buffer.length / 2);

  for (let i = 0; i < convertedBuffer.length / 2; i++) {
    const uint16 = buffer.readUInt16LE(i * 4);
    convertedBuffer.writeUInt16LE(uint16, i * 2);
  }

  return convertedBuffer;
}

class ConvertTo1ChannelStream extends Transform {
  constructor(source, options) {
    super(options);
  }

  _transform(data, encoding, next) {
    next(null, convertBufferTo1Channel(data));
  }
}

module.exports = {
  name: "join",
  description: "Make bot join a voice channel",
  not_active: true,
  async execute(message, args) {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      console.log("here");
      // console.log(message.guild.voice.connection)
      const receiver = connection.receiver;

      connection.on("speaking", (user, speaking) => {
        console.log("here");
        if (!speaking) {
          return;
        }

        console.log(`I'm listening to ${user.username}`);

        // this creates a 16-bit signed PCM, stereo 48KHz stream
        const audioStream = receiver.createStream(user, { mode: "pcm" });
        const requestConfig = {
          encoding: "LINEAR16",
          sampleRateHertz: 48000,
          languageCode: "en-US",
        };
        const request = {
          config: requestConfig,
        };
        const recognizeStream = googleSpeechClient
          .streamingRecognize(request)
          .on("error", console.error)
          .on("data", (response) => {
            const transcription = response.results
              .map((result) => result.alternatives[0].transcript)
              .join("\n")
              .toLowerCase();
            console.log(`Transcription: ${transcription}`);
          });

        const convertTo1ChannelStream = new ConvertTo1ChannelStream();

        audioStream.pipe(convertTo1ChannelStream).pipe(recognizeStream);

        audioStream.on("end", async () => {
          console.log("audioStream end");
        });
      });
    }
  },
};
