const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const fetch = require("node-fetch");
const database = require("../../models/test");

// API URLs for easier management
const API_URLS = {
  fuck: "https://purrbot.site/api/img/nsfw/fuck/gif",
  slap: "https://api.waifu.pics/sfw/slap",
};

// Helper function to fetch image and increment count
async function fetchAndUpdate(url, sender, target, name) {
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
    return { image, count: result.count };
  } catch (error) {
    throw new Error("Failed to fetch image or update database");
  }
}

// Create response with embed and button
function createEmbedResponse(interaction, target, subcommand, image, count) {
  const embed = new EmbedBuilder()
    .setColor("Random")
    .setImage(image)
    .setDescription(
      `${interaction.user} ${subcommand}s ${target} \n-# That's ${count} ${subcommand}s now`
    );

  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(subcommand)
      .setLabel(`${subcommand} back`)
      .setStyle(ButtonStyle.Success)
  );

  return { embed, button };
}

// Module exports
module.exports = {
  data: new SlashCommandBuilder()
    .setName("rp")
    .setDescription("Roleplay commands")
    .addSubcommand((cmd) =>
      cmd
        .setName("fuck")
        .setDescription("Fuck someone")
        .addUserOption((u) =>
          u.setName("person").setDescription("Person to fuck").setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("slap")
        .setDescription("Slap someone")
        .addUserOption((u) =>
          u.setName("person").setDescription("Person to slap").setRequired(true)
        )
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const subcommand = interaction.options.getSubcommand();
      const target = interaction.options.getUser("person");
      const url = API_URLS[subcommand];

      // Fetch image and update count
      const { image, count } = await fetchAndUpdate(
        url,
        interaction.user.id,
        target.id,
        subcommand
      );

      // Create response and send
      const { embed, button } = createEmbedResponse(
        interaction,
        target,
        subcommand,
        image,
        count
      );
      const reply = await interaction.editReply({
        content: `${target}`,
        embeds: [embed],
        components: [button],
      });

      // Wait for user interaction to "confirm" the action
      const collectorFilter = (i) => i.user.id === target.id;
      const confirmation = await reply.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      });

      if (confirmation.customId === subcommand) {
        await confirmation.update({ components: [] });

        // Update for back action
        const { image: newImage, count: newCount } = await fetchAndUpdate(
          url,
          target.id,
          interaction.user.id,
          subcommand
        );

        const updatedEmbed = new EmbedBuilder()
          .setColor("Random")
          .setImage(newImage)
          .setDescription(
            `${target} ${subcommand}s ${interaction.user} back\n-# That's ${newCount} ${subcommand}s now`
          );

        await confirmation.followUp({
          content: `${interaction.user}`,
          embeds: [updatedEmbed],
          components: [],
        });
      }
    } catch (error) {
      console.error(`Error in rp command: ${error}`);
      throw new Error("Something went wrong in the rp command");
    }
  },
};
