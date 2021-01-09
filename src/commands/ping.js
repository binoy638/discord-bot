module.exports = {
  name: "ping",
  description: "Ping!",

  active: false,
  cooldown: 5,
  execute(message, args) {
    let embed = {
      title: "This is the title",
    };
    message.channel.send(
      { embed: embed },
      "https://img-9gag-fun.9cache.com/photo/ajmrq98_460sv.mp4"
    );
  },
};
