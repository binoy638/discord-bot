var convert_audio = require("./convert_audio");
var transcribe = require("./transcribe");
const path = require("path");
const { setTimeout } = require("timers");
module.exports = async (connection, message, user, client) => {
  // connection.play(path.join("src/static", "sound.mp3"));

  if (!connection.dispatcher) {
    connection.play(path.join("src/static", "sound.mp3"));
  }
  // console.log("inside");
  // connection.dispatcher.pause();
  // const voiceChannel = message.member.voice.channel;
  // await voiceChannel.join().then((con) => {
  //   const dis = con.play(path.join("src/static", "sound.mp3"));
  // dis.on("finish", () => {
  //   connection.dispatcher.resume();
  //   connection.dispatcher.pause();
  //   connection.dispatcher.resume();
  // });
  // });
  // const n = connection.play(path.join("src/static", "sound.mp3"));

  setTimeout(() => {
    const audioStream = connection.receiver.createStream(user, {
      mode: "pcm",
    });

    let buffer = [];
    audioStream.on("data", (data) => {
      buffer.push(data);
    });
    audioStream.on("end", async () => {
      buffer = Buffer.concat(buffer);
      const duration = buffer.length / 48000 / 4;
      console.log("duration: " + duration);

      if (duration > 6) {
        // 20 seconds max dur
        console.log("TOO SHORT / TOO LONG; SKPPING");
        return;
      }

      try {
        let new_buffer = await convert_audio(buffer);

        transcribe(new_buffer, message, client);

        // let out = await transcribe(new_buffer);
        // if (out != null) process_commands_query(out, mapKey, user.id);
      } catch (e) {
        console.log("tmpraw rename: " + e);
      }
      // });
    });
  }, 1000);

  // console.log(audioStream);

  // setTimeout(async () => {
  //   audioStream.destroy();

  //   buffer = Buffer.concat(buffer);
  //   const duration = buffer.length / 48000 / 4;
  //   console.log("duration: " + duration);

  //   // if (duration < 1.0 || duration > 6) {
  //   //   // 20 seconds max dur
  //   //   console.log("TOO SHORT / TOO LONG; SKPPING");
  //   //   return;
  //   // }

  //   try {
  //     let new_buffer = await convert_audio(buffer);

  //     transcribe(new_buffer, channel, user.username);

  //     // let out = await transcribe(new_buffer);
  //     // if (out != null) process_commands_query(out, mapKey, user.id);
  //   } catch (e) {
  //     console.log("tmpraw rename: " + e);
  //   }
  // }, 5000);
};
