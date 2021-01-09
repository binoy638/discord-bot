module.exports = {
  name: "getgags",
  description:
    "Get regular posts from your favorite 9gag section in a specific channel.",
  usage: "<section name> <interval(in mins)>",
  active: true,
  args: true,
  args_limit: 2,
  cooldown: 5,
  execute(message, args) {
    const section = args[0];
    const interval = args[1];
    message.channel.send(
      `Fetching posts from 9gags/${section} every ${interval} mins.`
    );
  },
};
