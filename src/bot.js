require("dotenv").config();
const { token } = process.env;
const fs = require("fs");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.once("ready", () => {
  console.log(`${client.user.tag} is online!`);

  const voiceChannelId = "1123112104317157410";

  let channel = client.channels.cache.get(voiceChannelId);
  if (!channel) return console.error("The channel does not exist!");

  const voiceConnection = joinVoiceChannel({
    channelId: voiceChannelId,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  console.log("Successfully connected to the voice channel.");
});

client.handleEvents();
client.handleCommands();
client.login(token);
