const Discord = require("discord.js");
const fs = require("node:fs");
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Discord.Collection();

const eventFiles = fs.readdirSync(`./events`);
const commandFolders = fs.readdirSync(`./commands`);

// Command Handler

commandFolders.forEach((folder) => {
  fs.readdirSync(`./commands/${folder}`).forEach((file) => {
    const filePath = `../../commands/${folder}/${file}`; // Correct relative path

    try {
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.error(`[WARNING] ${filePath} is missing "data" or "execute".`);
      }
    } catch (error) {
      console.error(`Error loading command at ${filePath}:`, error); // Log error if the file cannot be loaded
    }
  });
});

// Event Handler

eventFiles.forEach((file) => {
  const filePath = `../../events/${file}`; // Use correct relative path
  try {
    const event = require(filePath); // Correct path to event
    const eventHandler = (...args) => event.execute(...args);
    event.once
      ? client.once(event.name, eventHandler)
      : client.on(event.name, eventHandler);
  } catch (error) {
    console.error(`Error loading event at ${filePath}:`, error); // Log error if event cannot be loaded
  }
});

client.login(process.env.token);

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error(`Caught exception: ${error}`);
});

// process.on("warning", (warn) => {
//   console.warn("Warning:", warn);
// });

client.on(Discord.ShardEvents.Error, (error) => {
  console.log(error);
});
