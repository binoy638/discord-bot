const Queue = require("../utils/queue");

const queue = new Queue();
class MusicPlayer {
  constructor(textChannel) {
    this.playerInfo = {
      textChannel,
      // voiceChannel,
      songs: queue,
      current: 0,
      // playing: true,
    };
  }

  addSong(obj) {
    this.playerInfo.songs.enqueue(obj);
  }
  skipSong() {
    console.log("skipping song");
    this.playerInfo.songs.dequeue();
  }
  nextSong() {
    const totaltracks = this.playerInfo.songs.size();
    if (this.playerInfo.current <= totaltracks - 1) {
      this.playerInfo.current += 1;
    } else {
      this.playerInfo.current = 0;
    }
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
  addplaylist(playlist) {
    playlist.map((track) => {
      this.playerInfo.songs.enqueue(track);
    });
  }
  isQueueEmpty() {
    return this.playerInfo.songs.isEmpty();
  }
}

module.exports = MusicPlayer;
