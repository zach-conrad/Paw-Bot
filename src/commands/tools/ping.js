const { SlashCommandBuilder } = require(`discord.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(`Returns users ping.`),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    });

    const newMessage = `API Latency: ${client.ws.ping}\nClient Ping: ${
      message.createdTimeStamp - interaction.createdTimeStamp
    } `;
    await interaction.editReply({
      content: newMessage,
    });
  },
};
