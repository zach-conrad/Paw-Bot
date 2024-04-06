module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: `Something went wrong, contact CarnivalCow if issue persists.`,
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      // Here you handle button interactions
      const member = interaction.member;
      const role = getRoleFromCustomId(interaction.customId, interaction.guild);

      if (!role) {
        await interaction.reply({
          content: "Role not found.",
          ephemeral: true,
        });
        return;
      }

      try {
        if (member.roles.cache.has(role.id)) {
          await member.roles.remove(role);
          await interaction.reply({
            content: `You no longer have the ${role.name} role.`,
            ephemeral: true,
          });
        } else {
          await member.roles.add(role);
          await interaction.reply({
            content: `You now have the ${role.name} role!`,
            ephemeral: true,
          });
        }
      } catch (error) {
        console.error("Error managing role:", error);
        await interaction.reply({
          content: "There was an error managing your role.",
          ephemeral: true,
        });
      }
    }
  },
};

function getRoleFromCustomId(customId, guild) {
  // Example mapping function. You will need to adjust this to match your customId to actual guild roles.
  // This example just directly matches custom IDs to role names as a placeholder.
  // You might have a more complex system or direct IDs to match.
  const rolesMapping = {
    "1123120817539141662": "Stream Ping", // These are placeholders. Replace them with your actual role IDs and names.
    "1190200928968659035": "Hoplite Ping",
    "1190201029036359761": "Lethal Company Ping",
    // Add more mappings as needed
  };

  const roleName = rolesMapping[customId];
  if (!roleName) return null;
  return guild.roles.cache.find((role) => role.name === roleName);
}
