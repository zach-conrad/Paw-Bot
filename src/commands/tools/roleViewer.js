const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

let storedMessageId = null;
let storedRoleSelectorMessageId = null;
let storedGuidelinesMessageId = null;

// Predefined role descriptions, keyed by role name
const roleDescriptions = {
  Deer: "The Deer is here",
  "Snow Leopard": "Snow Leopard with antlers",
  Fox: "Absolute mutilation or imminent death",
  Husky: "Husky with good ping",
  Dragon: "Crime Dragon",
  Fox2: "A silly, but deadly, little Fox",
  Dragon2: "Pancakes?",
  Protogen: "Are we sure..?",
  Dog: "Breezed",
  "Goated Cat": "A cat that is truly goated",
  Seal: "Vibing seal doing seally things",
  Marble: "He is. The marble man.",
  Bird: "That one parrot",
  Wolf: "Banana...na",
  Bird2: "Another bird",
  Raccoon: "Trash panda",
  Cow: "The moderator",
  "Polar Bear": "A polar bear with speed 3",
  Cat: "5 letter cat",
  Cat2: "Spanish words",
  Cat3: "Just some kitty",
  Person: "That one person who likes clovers",
  Person2: "That one person who likes comics",
  Duck: "The real one cracked at the craft",
  Person3: "That one person who likes animation",
  Person4: "That one person who is suspicious",
  Shiba: "Floof or no floof",
  Imposter: '"Ohio"',
  Goat: "Tired around 90% of the time",
  Fish: "A very pink fish",
  Stoat: "Causing may/hem",
  Goat2: "One that can be taken to the end :)",
  Protogen2: "Dog tho",
  Dragon3: "Smol and snuggable",
  Sheep: "A 0.164% chance of spawning in!",
  Person5: "That roommate type",
  Cat4: "A cat in the water",
  Unknown: "=^._.^= ∫",
  "Birthday!": "It is their birthday!",
  "Stream Ping": "Pings from Jerb!",
  "Hoplite Ping": "Ping for playing Hoplite!",
  "Lethal Company Ping": "Ping for playing Lethal Company!",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roleview")
    .setDescription(
      "Updates the message with the server's roles and their descriptions every two hours."
    ),
  async execute(interaction) {
    if (
      !interaction.guild ||
      !interaction.member.permissions.has("Administrator")
    ) {
      await interaction.reply({
        content: "You do not have permission for this command",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: "Role list update process initiated.",
      ephemeral: true,
    });

    await updateRolesMessage(interaction);
  },
};

async function updateRolesMessage(interaction) {
  const roles = interaction.guild.roles.cache
    .sort((a, b) => b.position - a.position)
    .filter((role) => !role.managed && role.id !== interaction.guild.id);

  let description = "";
  const embeds = [];

  for (const role of roles.values()) {
    const roleDescription = roleDescriptions[role.name] || "N/A";
    const roleLine = `${role.toString()} - ${roleDescription}\n`;

    if (description.length + roleLine.length > 4096) {
      embeds.push(
        new EmbedBuilder().setDescription(description).setColor(0x0099ff)
      );
      description = roleLine;
    } else {
      description += roleLine;
    }
  }

  if (description !== "") {
    embeds.push(
      new EmbedBuilder().setDescription(description).setColor(0x0099ff)
    );
  }

  if (storedMessageId) {
    try {
      const message = await interaction.channel.messages.fetch(storedMessageId);
      await message.edit({ embeds: [embeds.shift()] });
    } catch (error) {
      console.error("Error updating roles message:", error);
      storedMessageId = null;
    }
  }

  if (!storedMessageId && embeds.length > 0) {
    const sentMessage = await interaction.channel.send({
      embeds: [embeds.shift()],
    });
    storedMessageId = sentMessage.id;
  }

  // Continue sending any additional embeds if the first embed filled up
  for (const embed of embeds) {
    await interaction.channel.send({ embeds: [embed] });
  }

  // Check and send the role selector and guidelines message only if they have not been sent before
  if (!storedRoleSelectorMessageId) {
    const roleSelectorEmbed = new EmbedBuilder()
      .setTitle("Role Selector")
      .setDescription(
        "Click a button to assign yourself a role or to remove it."
      )
      .setColor(0x0099ff);

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("1123120817539141662")
        .setLabel("Stream Ping")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("1190200928968659035")
        .setLabel("Hoplite Ping")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("1190201029036359761")
        .setLabel("Lethal Company Ping")
        .setStyle(ButtonStyle.Primary)
    );

    const roleSelectorMessage = await interaction.channel.send({
      embeds: [roleSelectorEmbed],
      components: [buttons],
    });
    storedRoleSelectorMessageId = roleSelectorMessage.id;
  }

  if (!storedGuidelinesMessageId) {
    const guidelinesMessage = await interaction.channel.send(
      "\n\nPlease keep in mind this server is 17+, and anyone invited in the future should be at least 17. This also includes guest invites for VCs unless the guest is warned that there will be mature topics and language."
    );
    storedGuidelinesMessageId = guidelinesMessage.id;
  }
}
