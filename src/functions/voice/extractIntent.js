const Commando = require("discord.js-commando");

module.exports = (data, message, client) => {
  try {
    const {
      intents: [{ name: intent }],
    } = data;

    switch (intent) {
      case "playlist":
        const [playlistplay] = client.registry.findCommands(
          "playlistplay",
          true
        );
        console.log("Playing Playlist");
        playlistplay.run(message);
        break;
      case "wit$loop_music":
        const [loop] = client.registry.findCommands("loop", true);
        console.log("Loop");
        loop.run(message);
        break;
      case "wit$pause_music":
        const [pause] = client.registry.findCommands("pause", true);
        console.log("Pausing");
        pause.run(message);
        break;
      case "wit$resume_music":
        const [resume] = client.registry.findCommands("resume", true);
        console.log("Resuming");
        resume.run(message);
        break;
      case "wit$shuffle_playlist":
        const [shuffle] = client.registry.findCommands("shuffle", true);
        console.log("shuffle");
        shuffle.run(message);
        break;
      case "wit$skip_track":
        const [skip] = client.registry.findCommands("skip", true);
        console.log("skip");
        skip.run(message);
        break;
    }
  } catch (e) {
    console.log("cant detect voice command");
  }
};
