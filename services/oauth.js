require("dotenv").config();
const express = require("express");
const storage = require("./storage");

const app = express();

app.use(express.json());

// Step 1: Browser lands here after Discord redirect
// The access token is in the URL hash (#), which servers can't read,
// so we serve a tiny page that extracts it and POSTs it to /save-token
app.get("/callback", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <body>
            <p>Authorizing...</p>
            <script>
                const params = new URLSearchParams(window.location.hash.slice(1));
                const token = params.get('access_token');
                const state = params.get('state');

                if (!token || !state) {
                    document.body.innerText = '❌ Missing token or state. Try /authorize again.';
                } else {
                    fetch('/save-token', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token, state })
                    }).then(r => {
                        if (r.ok) {
                            document.body.innerText = '✅ Authorized! You can close this tab and go back to Discord.';
                        } else {
                            document.body.innerText = '❌ Failed to save token. Try /authorize again.';
                        }
                    }).catch(() => {
                        document.body.innerText = '❌ Network error. Try /authorize again.';
                    });
                }
            </script>
        </body>
        </html>
    `);
});

// Step 2: Receives the token from the browser and saves it
app.post("/save-token", (req, res) => {
    const { token, state } = req.body;

    if (!token || !state) {
        return res.status(400).send("Missing token or state");
    }

    console.log("✅ Bearer token received for user:", state);
    console.log("Token preview:", token.slice(0, 20) + "...");

    storage.setTokens(state, token, null); // implicit flow has no refresh token

    res.send("ok");
});

function startOAuthServer() {
    const port = process.env.PORT || 3000;
    app.listen(port, '0.0.0.0', () => console.log(`✅ OAuth server running on :${port}`));
}

module.exports = { startOAuthServer };