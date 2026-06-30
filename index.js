require("dotenv").config();

const { Client, GatewayIntentBits, Events } = require("discord.js");

const ping = require("./commands/ping");
const link = require("./commands/link");
const autoupdate = require("./commands/autoupdate");
const status = require("./commands/status");
const update = require("./commands/update");
const authorize = require("./commands/authorize");
const { startOAuthServer } = require("./services/oauth");
const { updateUser } = require("./services/updater");
const storage = require("./services/storage");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    startOAuthServer();
    setInterval(async () => {
    console.log("🔄 Running auto-update check...");

    const data = await storage.getAllUsers();

    for (const user of data) {
        if (!user.autoUpdate) continue;

        try {
            const stats = await updateUser(user.discordId);
            console.log(`✅ Auto-updated ${user.riotName}#${user.riotTag}: ${stats.currentRank}`);
        } catch (err) {
            console.error(`❌ Auto-update failed for ${user.discordId}:`, err.message);
        }
    }

}, 60 * 60 * 1000); // 1 Hour
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === "ping") return ping.execute(interaction);
    if (commandName === "link") return link.execute(interaction);
    if (commandName === "autoupdate") return autoupdate.execute(interaction);
    if (commandName === "status") return status.execute(interaction);
    if (commandName === "update") return update.execute(interaction);
    if (commandName === "authorize") return authorize.execute(interaction); 
});

client.login(process.env.TOKEN);