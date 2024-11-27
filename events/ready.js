const { Events } = require("discord.js");
const mongoose = require("mongoose");
const url = process.env.mongourl;

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    try {
      await mongoose
        .connect(url)
        .then(() => console.log("Connected to mongodb"));
    } catch (error) {
      console.log(`Error connecting to mongodb` + error);
    }
  },
};
