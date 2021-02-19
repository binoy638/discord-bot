class MusicPlayer {
  constructor(textChannel) {
    this.playerInfo = {
      textChannel,
      songs: [],
      current: 0,
    };
  }

  addSong(obj) {
    this.playerInfo.songs.push(obj);
  }
  skipSong() {
    if (!this.playerInfo.songs.length == 0) {
      this.playerInfo.songs.shift();
    }
  }
  setCurrentSong(no) {
    if (no > this.playerInfo.songs.length) {
      return false;
    }
    const trackno = no - 1;
    this.playerInfo.current = trackno;
    return true;
  }
  nextSong() {
    const totaltracks = this.playerInfo.songs.length;
    if (this.playerInfo.current < totaltracks - 1) {
      this.playerInfo.current += 1;
    } else {
      this.playerInfo.current = 0;
    }
  }
  currentSong() {
    return this.playerInfo.songs[this.playerInfo.current];
  }
  clearQueue() {
    this.playerInfo.songs = [];
  }
  showQueue() {
    return this.playerInfo.songs;
  }
  addplaylist(playlist) {
    playlist.map((track) => {
      this.playerInfo.songs.push(track);
    });
  }
  isQueueEmpty() {
    if (this.playerInfo.songs.length == 0) {
      return true;
    }
    return false;
  }
}

module.exports = MusicPlayer;
