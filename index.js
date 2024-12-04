const { Client, GatewayIntentBits, Collection } = require("discord.js");

const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;

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

// Set up a route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Keep-alive function to ping the app periodically
const keepAlive = () => {
  setInterval(() => {
    console.log("Pinging the server to keep it alive");
    fetch(`http://localhost:${port}`)
      .then((response) => response.text())
      .then(console.log);
  }, 5 * 60 * 1000); // Every 5 minutes
};

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  keepAlive(); // Start the keepalive function
});
