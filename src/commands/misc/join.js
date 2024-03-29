const prism = require("prism-media");
const Porcupine = require("@picovoice/porcupine-node");
const {
  GRASSHOPPER,
  BUMBLEBEE,
} = require("@picovoice/porcupine-node/builtin_keywords");
const voice_cmd = require("../../utils/voice/voice_cmd");
const msg = require("../../utils/voice/message");
const Commando = require("discord.js-commando");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "join",
      group: "misc",
      memberName: "join",
      description: "Make the voice assistant join a VC.",
      // ownerOnly: true,
    });
  }
  async run(message, args) {
    let master = message.member.user;
    const client = this.client;
    function chunkArray(array, size) {
      return Array.from(
        { length: Math.ceil(array.length / size) },
        (v, index) => array.slice(index * size, index * size + size)
      );
    }
    const { voice } = message.member;
    if (!voice.channelID) {
      message.reply("You must be in a voice channel");
      return;
    }

    const connection = await voice.channel.join();
    msg(message.channel);

    const userHandlers = new Porcupine([GRASSHOPPER, BUMBLEBEE], [0.9, 0.9]);
    const frameLength = userHandlers.frameLength;

    // const userStreams = connection.receiver.createStream(user, {
    //   mode: "opus",
    // });

    // const pcmStream = connection.receiver.createStream(user, {
    //   mode: "pcm",
    // });

    connection.on("speaking", async (user, speaking) => {
      if (speaking.bitfield == 0 || user.bot) {
        return;
      }
      if (user != master) {
        return;
      }
      console.log(`listening to ${user.username}`);
      const userStreams = connection.receiver.createStream(user, {
        mode: "opus",
      });
      const userDecoders = new prism.opus.Decoder({
        frameSize: 640,
        channels: 1,
        rate: 16000,
      });
      userStreams.pipe(userDecoders);

      let userFrameAccumulators = [];
      try {
        userDecoders.on("data", async (data) => {
          // Two bytes per Int16 from the data buffer
          let newFrames16 = new Array(data.length / 2);
          for (let i = 0; i < data.length; i += 2) {
            newFrames16[i / 2] = data.readInt16LE(i);
          }
          // Split the incoming PCM integer data into arrays of size Porcupine.frameLength. If there's insufficient frames, or a remainder,
          // store it in 'frameAccumulator' for the next iteration, so that we don't miss any audio data
          userFrameAccumulators = userFrameAccumulators.concat(newFrames16);
          let frames = chunkArray(userFrameAccumulators, frameLength);

          if (frames[frames.length - 1].length !== frameLength) {
            // store remainder from divisions of frameLength
            userFrameAccumulators = frames.pop();
          } else {
            userFrameAccumulators = [];
          }
          for (let frame of frames) {
            let index = userHandlers.process(frame);
            if (index !== -1) {
              if (index == 0) {
                console.log("wakeword detected");
                await voice_cmd(connection, message, user, client);
                // message.channel.send(`Listening to ${master.username}`);
              } else if (index == 1) {
                console.log("wakeword detected");
                await voice_cmd(connection, message, user, client);
                // message.channel.send(`Listening to ${master.username}`);
                // voice_cmd(connection, message.channel, user);
              }
            }
          }
        });
      } catch (error) {
        console.error(error);
      }
    });
  }
};
