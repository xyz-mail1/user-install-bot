const gifs = [
  "https://cdn.nekotina.com/images/6n3LCEwc.gif",
  "https://cdn.nekotina.com/images/O5Y-kLEU.gif",
  "https://cdn.nekotina.com/images/STdq95XJ.gif",
  "https://cdn.nekotina.com/images/YFln2HPE.gif",
  "https://cdn.nekotina.com/images/QkIt5wmi.gif",
  "https://cdn.nekotina.com/images/WoWSbG_w.gif",
  "https://cdn.nekotina.com/images/TyKfZH0a.gif",
  "https://cdn.nekotina.com/images/u2qHgafO.gif",
  "https://cdn.nekotina.com/images/rLv0A4hm.gif",
  "https://cdn.nekotina.com/images/aXXezsrh.gif",
  "https://cdn.nekotina.com/images/N19zaTyg.gif",
  "https://cdn.nekotina.com/images/OzD1od8M.gif",
  "https://cdn.nekotina.com/images/sOuMIqyi.gif",
  "https://cdn.nekotina.com/images/Acq4XnI4.gif",
  "https://cdn.nekotina.com/images/Ef3fwneI.gif",
  "https://cdn.nekotina.com/images/mNMHw7Lc.gif",
  "https://cdn.nekotina.com/images/U1Zqatwe.gif",
  "https://cdn.nekotina.com/images/1uNOhIKP.gif",
  "https://cdn.nekotina.com/images/0dLr5dL7.gif",
  "https://cdn.nekotina.com/images/XV9XyrPU.gif",
];

const database = require("../../models/test");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("69")
    .setDescription(
      "🍆 Stimulate a member with your mouth or tongue while he or she does the same to you."
    )
    .addUserOption((option) =>
      option
        .setName("person")
        .setDescription("The person to 69")
        .setRequired(true)
    )
    .setIntegrationTypes([0, 1])
    .setContexts([0, 1, 2]),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const gif = gifs[Math.floor(Math.random() * gifs.length)];

      const target = interaction.options.getUser("person");
      const [senderID, receiverID] = [interaction.user.id, target.id].sort();
      const descriptions = [
        `${interaction.user.username} and ${target.username} share mutual love. U///U`,
        `${interaction.user.username} and ${target.username} find mutual pleasure. U///U`,
        `${interaction.user.username} and ${target.username} are doing a 69. U///U`,
      ];
      const desc =
        descriptions[Math.floor(Math.random() * descriptions.length)];
      const model = database("sixnine");

      const getModel = await model.findOne({
        type: "sixnine",
        senderID,
        recieverID: receiverID,
      });

      // If no document exists, default to count 0
      const localCount = (getModel?.count || 0) + 1;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${desc}`,
          iconURL: `${interaction.user.avatarURL()}`,
        })
        .setColor("Random")
        .setImage(gif)
        .setDescription(`-# That's ${localCount} 69s now!!`);
      await interaction.editReply({ content: `${target}`, embeds: [embed] });
      await model.findOneAndUpdate(
        { type: "sixnine", senderID, recieverID: receiverID },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
    } catch (error) {
      console.log(error);
    }
  },
};
