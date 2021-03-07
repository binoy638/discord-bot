const events = require("events");
const player = new events.EventEmitter();
class MusicPlayer {
  constructor(guildID) {
    this.playerInfo = {
      guildID,
      voiceChannel: null,
      playlist: [],
      count: 0,
      isShuffled: false,
      shuffledtracksIds: [],
      current: 0,
      priority: false,
      timesPlayed: 0,
      status: 0, //0 - stopped, 1 - playing, 2 - paused
      loop: false,
    };
    player.on("playlistchange", () => {
      this.playerInfo.count = this.playerInfo.playlist.length;
    });
    // player.on("next", ()=> {
    //   if(this.playerInfo.current < this.playerInfo.count-1)
    //   {
    //     this.playerInfo.current += 1;
    //   }
    //   else
    //   {
    //     this.playerInfo.current = 0
    //   }
    // })
  }

  addSong(obj) {
    this.playerInfo.playlist.push(obj);
    player.emit("playlistchange");
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
    if (this.playerInfo.count === 0) {
      return;
    }
    if (this.playerInfo.isShuffled === false) {
      if (this.playerInfo.current < this.playerInfo.count - 1) {
        this.playerInfo.current += 1;
      } else {
        if (this.playerInfo.loop === true) {
          this.playerInfo.current = 0;
        } else {
          this.clearQueue();
        }
      }
      this.playerInfo.timesPlayed += 1;
      return;
    } else {
      this.viewplayer();
      if (this.playerInfo.timesPlayed < this.playerInfo.count) {
        const trackno = this.playerInfo.shuffledtracksIds[
          this.playerInfo.timesPlayed
        ];
        this.playerInfo.current = trackno;
        this.playerInfo.timesPlayed += 1;
      } else {
        if (this.playerInfo.loop === true) {
          this.playerInfo.timesPlayed = 0;
          const trackno = this.playerInfo.shuffledtracksIds[
            this.playerInfo.timesPlayed
          ];
          this.playerInfo.current = trackno;
          this.playerInfo.timesPlayed += 1;
        } else {
          this.clearQueue();
        }
      }
    }
    this.viewplayer();
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
    player.emit("playlistchange");
  }
  showQueue() {
    // console.log(this.playerInfo.playlist);

    return this.playerInfo.playlist;
  }
  addplaylist(playlist) {
    playlist.map((track) => {
      this.playerInfo.playlist.push(track);
    });
    player.emit("playlistchange");
  }
  isQueueEmpty() {
    if (this.playerInfo.playlist.length === 0) {
      return true;
    }
    return false;
  }
  shufflePlaylist() {
    console.log("inside suf pl");
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
    // const trackno = this.playerInfo.shuffledtracksIds[
    //   this.playerInfo.timesPlayed
    // ];
    // this.playerInfo.current = trackno;
    // this.playerInfo.timesPlayed += 1;
    this.viewplayer();
  }
  isShuffled() {
    return this.playerInfo.isShuffled;
  }
  flushcache() {
    this.playerInfo = {
      voiceChannel: null,
      playlist: [],
      count: 0,
      isShuffled: false,
      shuffledtracksIds: [],
      current: 0,
      priority: false,
      timesPlayed: 0,
      status: 0,
      loop: false,
    };
  }
  flushcache_() {
    this.playerInfo = {
      playlist: [],
      count: 0,
      isShuffled: false,
      shuffledtracksIds: [],
      current: 0,
      priority: false,
      timesPlayed: 0,
      status: 0,
      loop: false,
    };
  }
  setStatus(input) {
    if (input === 0 || input === 1 || input === 2) {
      this.playerInfo.status = input;
    }
  }
  getStatus() {
    return this.playerInfo.status;
  }
  setVoiceChannel(vc) {
    this.playerInfo.voiceChannel = vc;
  }
  getCurrentVoiceChannel() {
    return this.playerInfo.voiceChannel;
  }

  queueCount() {
    // if (this.playerInfo.loop === true) {
    return this.playerInfo.count;
    // }
    // return this.playerInfo.playlist.count - (this.playerInfo.current + 1);
  }
  loop() {
    this.playerInfo.loop = !this.playerInfo.loop;
    return this.playerInfo.loop;
  }
  viewplayer() {
    console.log(this.playerInfo);
  }
}

module.exports = MusicPlayer;
