const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { log } = require("node:console");
client.commands = new Collection();
const eventFiles = fs.readdirSync(`./events`);
const commandFolders = fs.readdirSync(`./commands`);
const fs = require("node:fs");

require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
});

// command handler

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
      console.error(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  });
});

// events handler

eventFiles.forEach((file) => {
  const filePath = `./events/${file}`;
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

// try logging in

try {
  client.login(process.env.token);
} catch (error) {
  return console.error(error);
}

// catch errors

process.on("uncaughtException", (err) => {
  console.error(`Caught exception: ${err}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection at:", err);
});
