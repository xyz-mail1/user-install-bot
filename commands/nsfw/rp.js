const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
  } = require("discord.js"),
  fetch = require("node-fetch"),
  database = require("../../models/test");
async function logic(url, sender, target, name) {
  try {
    const { link, url: fetchedUrl } = await (await fetch(url)).json();
    const image = url.includes("purrbot") ? link : fetchedUrl;
    const [senderID, receiverID] = [sender, target].sort();
    const model = database(name);
    const result = await model.findOneAndUpdate(
      { type: name, senderID, recieverID: receiverID },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    const count = result.count;
    const embed = new EmbedBuilder().setColor("Random").setImage(image);
    return { embed, count };
  } catch (error) {
    throw new Error(error);
  }
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("rp")
    .setDescription("roleplay commands")
    .addSubcommand((cmd) =>
      cmd
        .setName("fuck")
        .setDescription("fuck sm1")
        .addUserOption((u) =>
          u.setName("person").setDescription("person to fuck").setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("slap")
        .setDescription("slap someone")
        .addUserOption((u) =>
          u.setName("person").setDescription("person to slap").setRequired(true)
        )
    )
    .setIntegrationTypes([0, 1])
    .setContexts([0, 1, 2]),
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const subcommand = interaction.options.getSubcommand();
      const target = interaction.options.getUser("person");
      const map = {
        fuck: "https://purrbot.site/api/img/nsfw/fuck/gif",
        slap: "https://api.waifu.pics/sfw/slap",
      };
      const url = map[subcommand];

      const { embed, count } = await logic(
        url,
        interaction.user.id,
        target.id,
        subcommand
      );
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(subcommand)
          .setLabel(`${subcommand} back`)
          .setStyle(ButtonStyle.Success)
      );
      if (subcommand === "fuck")
        embed.setDescription(
          `${interaction.user} fucks ${target} \n-# Thats ${count} fucks now`
        );
      else if (subcommand === "slap")
        embed.setDescription(
          `${interaction.user} slaps ${target} \n-# Thats ${count} slaps now`
        );

      if (!embed)
        return interaction.editReply({ content: "error", ephemeral: true });
      const reply = await interaction.editReply({
        content: `${target}`,
        embeds: [embed],
        components: [button],
      });
      const collectorFilter = (i) => i.user.id === target.id;
      const confirmation = await reply.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      });
      if (confirmation.customId === "fuck") {
        await confirmation.update({ components: [] });

        const { embed, count } = await logic(
          "https://purrbot.site/api/img/nsfw/fuck/gif",
          interaction.user.id,
          target.id,
          subcommand
        );
        embed.setDescription(
          `${target} fucks back ${interaction.user} \n-# Thats ${count} fucks now`
        );

        if (!embed)
          return interaction.editReply({ content: "error", ephemeral: true });

        await confirmation.followUp({
          content: `${interaction.user}`,
          embeds: [embed],
          components: [],
        });
      }
      if (confirmation.customId === "slap") {
        await confirmation.update({ components: [] });

        const { embed, count } = await logic(
          "https://api.waifu.pics/sfw/slap",
          interaction.user.id,
          target.id,
          subcommand
        );
        embed.setDescription(
          `${target} slaps back ${interaction.user} \n-# Thats ${count} slaps now`
        );

        if (!embed)
          return interaction.editReply({ content: "error", ephemeral: true });

        await confirmation.followUp({
          content: `${interaction.user}`,
          embeds: [embed],
          components: [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
