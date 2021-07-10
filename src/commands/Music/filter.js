const Commando = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const musicPlayerInstance = require("../../utils/music/musicPlayerInstance");
const { String2Filter } = require("../../utils/misc/filterOpts");
const applyFilter = require("../../utils/music/applyFilter");
const checkUserVc = require("../../utils/checkUserVc");
const { MessageMenuOption, MessageMenu } = require("discord-buttons");
const { ErrorEmbed, SuccessEmbed } = require("../../utils/embed");
const filterMenu = require("../../buttons/filterMenu");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "filter",
      group: "music",
      aliases: ["fl"],
      memberName: "filter",
      description: "Apply filters on the music player.",
      args: [
        {
          key: "type",
          prompt: "Which filter you want to apply?",
          type: "string",
          oneOf: [
            "nightcore",
            "bassboost",
            "8D",
            "vaporwave",
            "karaoke",
            "phaser",
            "tremolo",
            "desilencer",
            "surrounding",
            "pulsator",
            "chorus",
            "clear",
          ],
          default: "",
        },
      ],
    });
  }
  async run(message, args) {
    const { channel } = message;
    const id = message.member.user.id;
    let connection = message.guild.me.voice.connection;

    if (!connection) {
      return ErrorEmbed(`No song is playing to apply filters.`, channel);
    }

    const voiceChannelMembers = message.guild.me.voice.channel.members;

    const isUserInVC = checkUserVc(voiceChannelMembers, id);

    if (!isUserInVC)
      return ErrorEmbed(
        `<@${id}> You must be in the same voice channel to use this command.`,
        channel
      );

    let dispatcher = connection.dispatcher;
    if (!dispatcher) {
      return ErrorEmbed("No song is playing to apply filters", channel);
    }
    const musicPlayer = musicPlayerInstance(message.channel);

    const filterType = args.type;

    if (!filterType) {
      const menu = filterMenu();
      message.channel.send("`Add Filters 🤖 \n`", menu);
    } else {
      let filterArgs = String2Filter[filterType];
      if (filterArgs) {
        applyFilter(filterArgs, connection, channel, musicPlayer);
        // SuccessEmbed(`Filter applied: \`${filterType}\``, channel);
      } else {
        ErrorEmbed("something went wrong, please try again later.", channel);
      }
    }
  }
};
