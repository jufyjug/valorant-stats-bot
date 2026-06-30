const storage = require("./storage");
const tracker = require("./tracker");
const { buildWidget } = require("./widget");
const { updateDiscordWidget } = require("./discordwidget");

async function updateUser(discordId) {
    const user = storage.getUser(discordId);
    if (!user) throw new Error("You haven't linked your Riot account.");

    const stats = await tracker.getMMR("ap", user.riotName, user.riotTag);
    const widget = buildWidget(stats, user);
    await updateDiscordWidget(discordId, widget);

    return stats;
}

module.exports = {
    updateUser
};