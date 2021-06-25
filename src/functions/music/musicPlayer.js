const events = require("events");
const player = new events.EventEmitter();
class MusicPlayer {
  constructor(guildID) {
    this.guildID = guildID;
    this.voiceChannel = null;
    this.playlist = [];
    this.count = 0;
    this.isShuffled = false;
    this.shuffledtracksIds = [];
    this.current = 0;
    this.priority = false;
    this.timesPlayed = 0;
    this.status = 0; //0 - stopped, 1 - playing, 2 - paused
    this.loop = false;
    this.seek = 0;
    this.audioFilter = "dynaudnorm=f=200";
    this.message = null;

    player.on("playlistchange", () => {
      this.count = this.playlist.length;
    });
  }

  addSong(obj) {
    this.playlist.push(obj);
    player.emit("playlistchange");
  }
  skipSong() {
    if (!this.playlist.length == 0) {
      this.playlist.shift();
    }
  }
  setCurrentSong(no) {
    if (no > this.playlist.length) {
      return false;
    }
    const trackno = no - 1;
    this.current = trackno;
    this.priority = true;
    return true;
  }
  nextSong() {
    if (this.priority === true) {
      this.priority = false;
      return;
    }
    if (this.count === 0) {
      return;
    }
    if (this.isShuffled === false) {
      if (this.current < this.count - 1) {
        this.current += 1;
      } else {
        if (this.loop === true) {
          this.current = 0;
        } else {
          this.clearQueue();
        }
      }
      this.timesPlayed += 1;
      return;
    } else {
      // this.viewplayer();
      if (this.timesPlayed < this.count) {
        const trackno = this.shuffledtracksIds[this.timesPlayed];
        this.current = trackno;
        this.timesPlayed += 1;
      } else {
        if (this.loop === true) {
          this.timesPlayed = 0;
          const trackno = this.shuffledtracksIds[this.timesPlayed];
          this.current = trackno;
          this.timesPlayed += 1;
        } else {
          this.clearQueue();
        }
      }
    }
    // this.viewplayer();
  }

  currentSong() {
    if (this.playlist.length === 0) {
      return;
    }
    return this.playlist[this.current];
  }
  clearQueue() {
    this.shuffledtracksIds = [];
    this.playlist = [];
    player.emit("playlistchange");
  }
  showQueue() {
    // console.log(this.playlist);

    return this.playlist;
  }
  addplaylist(playlist) {
    playlist.map((track) => {
      this.playlist.push(track);
    });
    player.emit("playlistchange");
  }
  isQueueEmpty() {
    if (this.playlist.length === 0) {
      return true;
    }
    return false;
  }
  shufflePlaylist() {
    let length = this.playlist.length;
    let tracks = [...Array(length).keys()];

    let temp, i;
    while (length) {
      i = Math.floor(Math.random() * length--);
      temp = tracks[length];
      tracks[length] = tracks[i];
      tracks[i] = temp;
    }

    this.isShuffled = true;
    this.shuffledtracksIds = tracks;
    // const trackno = this.shuffledtracksIds[
    //   this.timesPlayed
    // ];
    // this.current = trackno;
    // this.timesPlayed += 1;
    // this.viewplayer();
  }
  isShuffled() {
    return this.isShuffled;
  }
  flushcache() {
    this.playlist = [];
    this.count = 0;
    this.isShuffled = false;
    this.shuffledtracksIds = [];
    this.current = 0;
    this.timesPlayed = 0;
    this.status = 0;
    this.loop = false;
  }

  setStatus(input) {
    if (input === 0 || input === 1 || input === 2) {
      this.status = input;
    }
  }
  getStatus() {
    return this.status;
  }
  setVoiceChannel(vc) {
    this.voiceChannel = vc;
  }
  getCurrentVoiceChannel() {
    return this.voiceChannel;
  }

  queueCount() {
    // if (this.loop === true) {
    return this.count;
    // }
    // return this.playlist.count - (this.current + 1);
  }
  loop() {
    this.loop = !this.loop;
    return this.loop;
  }
  viewplayer() {
    console.log(this);
  }
  setAudioFilter(filter) {
    const AvailabeFilters = [
      "bass=g=20,dynaudnorm=f=200", //bassboost
      "apulsator=hz=0.08", //8D
      "aresample=48000,asetrate=48000*0.8", //vaporwave
      "atempo=1.06,asetrate=44100*1.25", //nightcore
      "aresample=48000,asetrate=48000*1.25", //nightcore2
      "aphaser=in_gain=0.4", //phaser
      "tremolo", //tremolo
      "vibrato=f=6.5", //vibrato
      "surround", //surrounding
      "apulsator=hz=1", //pulsator
      "asubboost", //subboost
      "chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3", //chorus of 3
      "stereotools=mlev=0.015625", //karaoke
      "sofalizer=sofa=/path/to/ClubFritz12.sofa:type=freq:radius=2:rotation=5", //sofa
      "silenceremove=window=0:detection=peak:stop_mode=all:start_mode=all:stop_periods=-1:stop_threshold=0", //desilencer
      "dynaudnorm=f=200",
    ];
    if (!AvailabeFilters.includes(filter)) throw "Invalid Filter";
    this.audioFilter = filter;
  }
  setSeekTime(time) {
    this.seek = time;
  }
}

module.exports = MusicPlayer;
