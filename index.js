const { Client, GatewayIntentBits, Collection } = require("discord.js");

const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
});

client.commands = new Collection();

const commandFolders = fs.readdirSync(`./commands`);

commandFolders.forEach((folder) => {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));

  commandFiles.forEach((file) => {
    const filePath = `./commands/${folder}/${file}`;
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  });
});

const eventFiles = fs.readdirSync(`./events`);

eventFiles.forEach((file) => {
  const filePath = `./events/${file}`;
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

if (!process.env.token) {
  return console.log("Bot token not found in .env");
} else {
  client.login(process.env.token);
}

process.on("uncaughtException", (err) => {
  console.log(`Caught exception: ${err}`);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection at:", err);
});
