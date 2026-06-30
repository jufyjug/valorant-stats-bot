require("dotenv").config();

const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),

    new SlashCommandBuilder()
    .setName("link")
    .setDescription("Link your Riot account")
    .addStringOption(option =>
        option
            .setName("riot_id")
            .setDescription("Format: Name#Tag")
            .setRequired(true)
    ),

    new SlashCommandBuilder()
    .setName("autoupdate")
    .setDescription("Toggle hourly rank updates")
    .addStringOption(option =>
        option
            .setName("mode")
            .setDescription("on or off")
            .setRequired(true)
            .addChoices(
                { name: "on", value: "on" },
                { name: "off", value: "off" }
            )
    ),

    new SlashCommandBuilder()
        .setName("update")
        .setDescription("Refresh your Valorant widget"),
        
    new SlashCommandBuilder()
        .setName("status")
        .setDescription("Show your current widget settings"),

    new SlashCommandBuilder()
    .setName("authorize")
    .setDescription("Authorize the bot to update your Discord widget"),

].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Registering slash commands...");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log("✅ Slash commands registered!");
    } catch (error) {
        console.error(error);
    }
})();