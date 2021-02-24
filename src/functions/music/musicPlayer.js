class MusicPlayer {
  constructor(textChannel) {
    textChannel = this.textChannel;
    this.playerInfo = {
      textChannel,
      playlist: [],
      isShuffled: false,
      shuffledtracksIds: [],
      current: 0,
      priority: false,
      timesPlayed: 0,
    };
  }

  addSong(obj) {
    this.playerInfo.playlist.push(obj);
  }
  skipSong() {
    if (!this.playerInfo.playlist.length == 0) {
      this.playerInfo.playlist.shift();
    }
  }
  setCurrentSong(no) {
    if (no > this.playerInfo.playlist.length) {
      return false;
    }
    const trackno = no - 1;
    this.playerInfo.current = trackno;
    this.playerInfo.priority = true;
    return true;
  }
  nextSong() {
    if (this.playerInfo.priority === true) {
      this.playerInfo.priority = false;
      return;
    }
    if (this.playerInfo.playlist.length === 0) {
      return;
    }
    if (this.playerInfo.isShuffled === false) {
      const totaltracks = this.playerInfo.playlist.length;
      if (this.playerInfo.current < totaltracks - 1) {
        this.playerInfo.current += 1;
      } else {
        this.playerInfo.current = 0;
      }
      this.playerInfo.timesPlayed += 1;
      return;
    }
    const trackno = this.playerInfo.shuffledtracksIds[
      this.playerInfo.timesPlayed
    ];
    this.playerInfo.current = trackno;
    this.playerInfo.timesPlayed += 1;
  }

  currentSong() {
    if (this.playerInfo.playlist.length === 0) {
      return;
    }
    return this.playerInfo.playlist[this.playerInfo.current];
  }
  clearQueue() {
    this.playerInfo.shuffledtracksIds = [];
    this.playerInfo.playlist = [];
  }
  showQueue() {
    return this.playerInfo.playlist;
  }
  addplaylist(playlist) {
    playlist.map((track) => {
      this.playerInfo.playlist.push(track);
    });
  }
  isQueueEmpty() {
    if (this.playerInfo.playlist.length == 0) {
      return true;
    }
    return false;
  }
  shufflePlaylist() {
    let length = this.playerInfo.playlist.length;
    let tracks = [...Array(length).keys()];

    let temp, i;
    while (length) {
      i = Math.floor(Math.random() * length--);
      temp = tracks[length];
      tracks[length] = tracks[i];
      tracks[i] = temp;
    }

    this.playerInfo.isShuffled = true;
    this.playerInfo.shuffledtracksIds = tracks;
    const trackno = this.playerInfo.shuffledtracksIds[
      this.playerInfo.timesPlayed
    ];
    this.playerInfo.current = trackno;
    this.playerInfo.timesPlayed += 1;
  }
  isShuffled() {
    return this.playerInfo.isShuffled;
  }
  flushcache() {
    this.playerInfo = {
      textChannel: this.textChannel,
      playlist: [],
      isShuffled: false,
      shuffledtracksIds: [],
      current: 0,
      priority: false,
      timesPlayed: 0,
    };
  }
}

module.exports = MusicPlayer;
