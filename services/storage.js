const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../data/users.json");

function loadData() {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function saveData(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function setUser(discordId, riotName, riotTag) {
    const data = loadData();

    data[discordId] = {
        riotName,
        riotTag,
        autoUpdate: false,
        lastUpdate: 0
    };

    saveData(data);
}

function getUser(discordId) {
    return loadData()[discordId];
}

function setAutoUpdate(discordId, value) {
    const data = loadData();

    if (!data[discordId]) return;

    data[discordId].autoUpdate = value;

    saveData(data);
}

function getAutoUpdate(discordId) {
    const data = loadData();
    return data[discordId]?.autoUpdate ?? false;
}

function updateLastUpdate(discordId) {
    const data = loadData();

    if (!data[discordId]) return;

    data[discordId].lastUpdate = Date.now();

    saveData(data);
}

function setTokens(discordId, accessToken, refreshToken) {
    const data = loadData();
    if (!data[discordId]) return;
    data[discordId].accessToken = accessToken;
    data[discordId].refreshToken = refreshToken;
    saveData(data);
}

function getTokens(discordId) {
    const user = loadData()[discordId];
    return {
        accessToken: user?.accessToken ?? null,
        refreshToken: user?.refreshToken ?? null
    };
}

function getAllUsers() {
    return loadData();
}

module.exports = {
    setUser, getUser,
    setAutoUpdate, getAutoUpdate,
    updateLastUpdate,
    setTokens, getTokens,
    getAllUsers 
};