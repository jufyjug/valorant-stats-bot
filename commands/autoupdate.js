const storage = require("../services/storage");

async function execute(interaction) {

    const mode = interaction.options.getString("mode"); // "on" | "off"

    const value = mode === "on";

    await storage.setAutoUpdate(interaction.user.id, value);

    await interaction.reply({
        content: `🔄 Auto update is now **${value ? "ON" : "OFF"}**`,
        ephemeral: true
    });
}

module.exports = { execute };