const musicPlayerInstance = require("../utils/music/musicPlayerInstance");

module.exports = {
  name: "clickButton",
  async execute(button) {
    const { client, message } = button;
    let musicPlayer = musicPlayerInstance(message.channel);
    switch (button.id) {
      case "pause":
        button.defer();
        if (!musicPlayer) return;
        if (musicPlayer.message.id !== message.id) return;
        const [pause] = client.registry.findCommands("pause", true);
        pause.run(message, button.clicker);
        break;
      case "play":
        button.defer();
        if (!musicPlayer) return;
        if (musicPlayer.message.id !== message.id) return;
        const [resume] = client.registry.findCommands("resume", true);
        resume.run(message, button.clicker);
        break;
      case "stop":
        button.defer();
        if (!musicPlayer) return;
        if (musicPlayer.message.id !== message.id) return;
        const [disconnect] = client.registry.findCommands("disconnect", true);
        disconnect.run(message, button.clicker);
        break;
      case "next":
        button.defer();
        if (!musicPlayer) return;
        if (musicPlayer.message.id !== message.id) return;
        const [skip] = client.registry.findCommands("skip", true);
        skip.run(message, button.clicker);
        break;
    }
  },
};
