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
      const getModel = await model.findOne({
        type: "blowjob",
        senderID,
        recieverID: receiverID,
      });

      // If no document exists, default to count 0
      const localCount = (getModel?.count || 0) + 1;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${interaction.user.username} is sucking ${target.username} uwaa`,
          iconURL: `${interaction.user.avatarURL()}`,
        })
        .setColor("Random")
        .setImage(link)
        .setDescription(`-# That's ${localCount} blowjobs now!`);
      await interaction.editReply({
        content: `${target}`,
        embeds: [embed],
      });
      await model.findOneAndUpdate(
        { type: "blowjob", senderID, recieverID: receiverID },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
    } catch (error) {
      await interaction.editReply({
        content: "there was an error while running the command",
      });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1 second before deleting the reply
      return console.log(error);
    }
  },
};
