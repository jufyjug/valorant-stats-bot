const storage = require("../services/storage");

async function execute(interaction) {

    const user = await storage.getUser(interaction.user.id);

    if (!user) {
        return interaction.reply({
            content: "❌ You are not linked yet.",
            ephemeral: true
        });
    }

    await interaction.reply({
        content: `📊 **Status**\nRiot: ${user.riotName}#${user.riotTag}\nAuto Update: ${user.autoUpdate ? "ON" : "OFF"}`,
        ephemeral: true
    });
}

module.exports = { execute };