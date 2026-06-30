const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connect() {
    if (!db) {
        await client.connect();
        db = client.db("valorant-bot");
    }
    return db.collection("users");
}

async function setUser(discordId, riotName, riotTag) {
    const col = await connect();
    await col.updateOne(
        { discordId },
        { $set: { discordId, riotName, riotTag, autoUpdate: false, lastUpdate: 0 } },
        { upsert: true }
    );
}

async function getUser(discordId) {
    const col = await connect();
    return col.findOne({ discordId });
}

async function setAutoUpdate(discordId, value) {
    const col = await connect();
    await col.updateOne({ discordId }, { $set: { autoUpdate: value } });
}

async function getAutoUpdate(discordId) {
    const user = await getUser(discordId);
    return user?.autoUpdate ?? false;
}

async function updateLastUpdate(discordId) {
    const col = await connect();
    await col.updateOne({ discordId }, { $set: { lastUpdate: Date.now() } });
}

async function setTokens(discordId, accessToken, refreshToken) {
    const col = await connect();
    await col.updateOne({ discordId }, { $set: { accessToken, refreshToken } });
}

async function getTokens(discordId) {
    const user = await getUser(discordId);
    return {
        accessToken: user?.accessToken ?? null,
        refreshToken: user?.refreshToken ?? null
    };
}

async function getAllUsers() {
    const col = await connect();
    return col.find({}).toArray();
}

module.exports = {
    setUser, getUser,
    setAutoUpdate, getAutoUpdate,
    updateLastUpdate,
    setTokens, getTokens,
    getAllUsers
};