var convert_audio = require("./convert_audio");
var transcribe = require("./transcribe");
const path = require("path");
const { setTimeout } = require("timers");
module.exports = async (connection, message, user, client) => {
  // connection.play(path.join("src/static", "sound.mp3"));

  if (!connection.dispatcher) {
    connection.play(path.join("src/static", "sound.mp3"));
  } else {
    connection.dispatcher.setVolume(0.3);
    setTimeout(() => {
      connection.dispatcher.setVolume(1);
    }, 3000);
  }

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
