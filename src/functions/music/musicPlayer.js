const Queue = require("../utils/queue");

const queue = new Queue();
class MusicPlayer {
  constructor(textChannel, voiceChannel) {
    this.playerInfo = {
      textChannel,
      voiceChannel,
      songs: queue,
      // playing: true,
    };
  }
  addSong(obj) {
    this.playerInfo.songs.enqueue(obj);
  }
  skipSong() {
    this.playerInfo.songs.dequeue();
  }
  currentSong() {
    return this.playerInfo.songs.front();
  }
  clearQueue() {
    this.playerInfo.songs.clear();
  }
  showQueue() {
    return this.playerInfo.songs.show();
  }
  isQueueEmpty() {
    return this.playerInfo.songs.isEmpty();
  }
  // pause() {
  //   this.playerInfo.connection.dispatcher.pause();
  // }
  // resume() {
  //   console.log("resuming..");
  //   this.playerInfo.connection.dispatcher.resume();
  // }
  // skip() {
  //   this.playerInfo.connection.dispatcher.end();
  // }
}

module.exports = MusicPlayer;
