const playerButtons = require("../buttons/playerButtons");

module.exports = {
  name: "clickButton",
  async execute(button) {
    const { client, message } = button;
    switch (button.id) {
      case "pause":
        button.defer();
        console.log("pause button clicked");
        const [pause] = client.registry.findCommands("pause", true);
        pause.run(message);
        break;
      case "play":
        button.defer();
        console.log("play button clicked");
        const [resume] = client.registry.findCommands("resume", true);
        resume.run(message);
        break;
      case "stop":
        button.defer();
        console.log("stop button clicked");
        const [disconnect] = client.registry.findCommands("disconnect", true);
        disconnect.run(message);
        break;
      case "next":
        button.defer();
        console.log("next button clicked");
        const [skip] = client.registry.findCommands("skip", true);
        skip.run(message);
        break;
    }
  },
};
