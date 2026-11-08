require("dotenv").config();
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("ok"));

app.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.send("❌ Missing code.");

    const r = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: process.env.REDIRECT_URI
        })
    });
    const t = await r.json();
    if (!t.access_token) {
        console.error(t);
        return res.send("❌ Authorization failed. Run /authorize again.");
    }
    res.send("✅ Authorized! You can close this tab.");
});

app.listen(process.env.PORT || 3000, "0.0.0.0");
