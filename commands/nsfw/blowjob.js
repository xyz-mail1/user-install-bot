const jsonArray = require("../../data/bj.json");
const db = require("../../models/test");

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("blowjob")
    .setDescription("suck shiv i mean someone~")
    .addUserOption((option) =>
      option
        .setName("person")
        .setDescription("The person to suck")
        .setRequired(true)
    )
    .setIntegrationTypes([0, 1])
    .setContexts([0, 1, 2]),
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const target = interaction.options.getUser("person");
      const link = jsonArray[Math.floor(Math.random() * jsonArray.length)];
      const [senderID, receiverID] = [interaction.user.id, target.id].sort();
      const model = db("blowjob");
      const result = await model.findOneAndUpdate(
        { type: "blowjob", senderID, recieverID: receiverID },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
      const embed = new EmbedBuilder()
        .setColor("Random")
        .setImage(link)
        .setDescription(
          `**${interaction.user.username}** is sucking **${target.username}** uwaa\n-# That's ${result.count} blowjobs now!`
        );
      await interaction.editReply({ content: `${target}`, embeds: [embed] });
    } catch (error) {
      await interaction.editReply({
        content: "there was an error while running the command",
        ephemeral: true,
      });
      return console.log(error);
    }
  },
};
