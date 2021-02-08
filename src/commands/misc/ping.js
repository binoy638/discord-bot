var cache = require("../../functions/cache");
const Queue = require("../../functions/utils/queue");
var queue = new Queue();
module.exports = {
  name: "ping",
  description: "Ping!",
  category: "Misc",
  active: false,

  execute(message, args) {
    let songQueue = {
      textChannel: message.channel,
      // voiceChannel: voiceChannel,
      connection: null,
      songs: queue,
      playing: true,
    };
    songQueue.songs.enqueue("Eminem");
    songQueue.songs.enqueue({
      title: "Eminem",
      link: "somelink",
      Image: "someimage",
    });
    console.log(songQueue.songs.show());
    // queue.enqueue(14);
    // queue.enqueue(13);
    // queue.enqueue(13);
    // queue.enqueue(11);
    // console.log(queue.show());
  },
};
