const buttons = require("discord-buttons");

module.exports = () => {
  let option1 = new buttons.MessageMenuOption()
    .setLabel("Nightcore")
    .setValue("filterNightcore");

  let option2 = new buttons.MessageMenuOption()
    .setLabel("Bassboost")
    .setValue("filterbassboost");

  let option3 = new buttons.MessageMenuOption()
    .setLabel("8D")
    .setValue("filter8D");

  let option4 = new buttons.MessageMenuOption()
    .setLabel("Vaporwave")
    .setValue("filtervaporwave");

  let option5 = new buttons.MessageMenuOption()
    .setLabel("karaoke")
    .setValue("filterkaraoke");

  let option6 = new buttons.MessageMenuOption()
    .setLabel("Phaser")
    .setValue("filterphaser");

  let option7 = new buttons.MessageMenuOption()
    .setLabel("Tremolo")
    .setValue("filtertremolo");

  let option8 = new buttons.MessageMenuOption()
    .setLabel("Desilencer")
    .setValue("filterdesilencer");

  let option9 = new buttons.MessageMenuOption()
    .setLabel("Surrounding")
    .setValue("filtersurrounding");

  let option10 = new buttons.MessageMenuOption()
    .setLabel("Pulsator")
    .setValue("filterpulsator");

  let option11 = new buttons.MessageMenuOption()
    .setLabel("Chorus")
    .setValue("filterchorus");

  let option = new buttons.MessageMenuOption()
    .setEmoji("❌")
    .setLabel("Clear")

    .setValue("filterclear");

  return new buttons.MessageMenu()
    .setID("AudioFilter")
    .setPlaceholder("Select Audio Filter")
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions(
      option,
      option1,
      option2,
      option3,
      option4,
      option5,
      option6,
      option7,
      option8,
      option9,
      option10,
      option11
    );
};
