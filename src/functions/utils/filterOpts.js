const Emoji2Filter = {
  "1️⃣": "bass=g=20,dynaudnorm=f=200",
  "2️⃣": "apulsator=hz=0.08",
  "3️⃣": "aresample=48000,asetrate=48000*0.8",
  "4️⃣": "stereotools=mlev=0.015625",
  "5️⃣": "aphaser=in_gain=0.4",
  "6️⃣": "tremolo",
  "7️⃣":
    "silenceremove=window=0:detection=peak:stop_mode=all:start_mode=all:stop_periods=-1:stop_threshold=0",
  "8️⃣": "surround",
  "❎": "dynaudnorm=f=200",
  "0️⃣": "atempo=1.06,asetrate=44100*1.25",
  "9️⃣": "apulsator=hz=1",
  "🔟": "chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3",
  //   "#️⃣": "stereotools=mlev=0.015625",
  //   "*️⃣":
  //     "silenceremove=window=0:detection=peak:stop_mode=all:start_mode=all:stop_periods=-1:stop_threshold=0",
};

const String2Filter = {
  bassboost: "bass=g=20,dynaudnorm=f=200",
  "8D": "apulsator=hz=0.08",
  vaporwave: "aresample=48000,asetrate=48000*0.8",
  karaoke: "stereotools=mlev=0.015625",
  phaser: "aphaser=in_gain=0.4",
  tremolo: "tremolo",
  desilencer:
    "silenceremove=window=0:detection=peak:stop_mode=all:start_mode=all:stop_periods=-1:stop_threshold=0",
  surrounding: "surround",
  clear: "dynaudnorm=f=200",
  nightcore: "atempo=1.06,asetrate=44100*1.25",
  pulsator: "apulsator=hz=1",
  chorus: "chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3",
  //   "#️⃣": "stereotools=mlev=0.015625",
  //   "*️⃣":
  //     "silenceremove=window=0:detection=peak:stop_mode=all:start_mode=all:stop_periods=-1:stop_threshold=0",
};

module.exports = { Emoji2Filter, String2Filter };
