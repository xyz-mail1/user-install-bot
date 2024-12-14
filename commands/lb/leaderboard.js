const db = require("../../models/test");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("fdshdfgh"),
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const model = db("hug");
      const topHugs = await model.find().sort({ count: -1 }).limit(5);
      const lb = await Promise.all(
        topHugs.map(async (entry, index) => {
          const sender = await interaction.client.users
            .fetch(entry.senderID)
            .catch(() => null);
          const receiver = await interaction.client.users
            .fetch(entry.recieverID)
            .catch(() => null);
          return `${index + 1}. **${sender?.displayName || "unknown"}** ➜ **${
            receiver?.displayName || "unknown"
          }**: ${entry.count} hugs`;
        })
      );

      const embed = new EmbedBuilder().setDescription(lb.join("\n"));
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
    }
  },
};
