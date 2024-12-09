const jsonArray = require("../../data/spank.json");
const db = require("../../models/test");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Random, nodeCrypto } = require("random-js");
const random = new Random(nodeCrypto);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spank")
    .setDescription("spank someone~")
    .addUserOption((option) =>
      option
        .setName("person")
        .setDescription("The person to spank")
        .setRequired(true)
    )
    .setIntegrationTypes([0, 1])
    .setContexts([0, 1, 2]),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const v = random.pick(jsonArray, 0, 19);

      const target = interaction.options.getUser("person");

      const [senderID, receiverID] = [interaction.user.id, target.id].sort();
      const model = db("spank");

      const getModel = await model.findOne({
        type: "spank",
        senderID,
        recieverID: receiverID,
      });

      // If no document exists, default to count 0
      const localCount = (getModel?.count || 0) + 1;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${interaction.user.username} spanks ${target.username}`,
          iconURL: `${interaction.user.avatarURL()}`,
        })
        .setColor("Random")
        .setImage(v)
        .setDescription(`-# That's ${localCount} spanks now!`);
      await interaction.editReply({
        content: `${target}`,
        embeds: [embed],
      });
      await model.findOneAndUpdate(
        { type: "spank", senderID, recieverID: receiverID },
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
