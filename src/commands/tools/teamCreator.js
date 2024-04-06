const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("team")
    .setDescription("Creates teams of a set amount.")
    .addIntegerOption((option) =>
      option
        .setName("teamsize")
        .setDescription("Number of members in each team")
        .setRequired(true)
    ),

  async execute(interaction) {
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
      return array;
    }

    function createTeams(members, teamSize) {
      const teams = [];
      for (let i = 0; i < members.length; i += teamSize) {
        teams.push(members.slice(i, i + teamSize));
      }
      return teams;
    }

    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: "You need to be in a voice channel to use this command.",
        ephemeral: true,
      });
    }

    const voiceChannel = interaction.member.voice.channel;
    let members = Array.from(voiceChannel.members.values()).filter(
      (member) => !member.user.bot
    );
    members = shuffleArray(members);

    const teamSize = interaction.options.getInteger("teamsize");
    const teams = createTeams(members, teamSize);

    const teamNames = shuffleArray([
      "BIG DEER",
      "SMOL DEER",
      "CRAZY DEER",
      "LOSING DEER",
      "LOCO DEER",
      "DEER NUTS",
      "BALLS",
      "TWIST HIS DICK",
      "GIGANTIC DEER",
      "QUEER DEER",
      "STAR DEER",
      "DEERSONA?",
      "RUN DEER",
      "DEERFUCK",
      "FUCKDEER",
      "DEER",
      "MASSIVE DEER",
      "JEEP GRAND CHEROKEE",
    ]);

    const embed = new EmbedBuilder()
      .setTitle("Teams Created")
      .setColor(0x00ae86);

    teams.forEach((team, index) => {
      const teamName = `Team ${teamNames[index] || `#${index + 1}`}`;
      const teamMembersNames = team
        .map((member) => member.displayName)
        .join(", ");
      embed.addFields({
        name: teamName,
        value: teamMembersNames,
        inline: false,
      });
    });

    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
