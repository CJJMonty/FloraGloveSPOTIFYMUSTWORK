const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const cors = require("cors");

const app = express();
app.use(cors());

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

app.get("/login", (req, res) => {
  const scopes = ["user-modify-playback-state", "user-read-playback-state"];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    spotifyApi.setAccessToken(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);

    console.log("REFRESH TOKEN:", data.body.refresh_token);   // <-- ADD THIS

    res.send("Spotify connected. You can close this window.");
  } catch (err) {
    res.send("Error during authentication");
  }
});

app.get("/play", async (req, res) => {
  try {
    await spotifyApi.play();
    res.send("Playing");
  } catch (err) {
    res.send("Error");
  }
});

app.get("/pause", async (req, res) => {
  try {
    await spotifyApi.pause();
    res.send("Paused");
  } catch (err) {
    res.send("Error");
  }
});

app.get("/next", async (req, res) => {
  try {
    await spotifyApi.skipToNext();
    res.send("Next track");
  } catch (err) {
    res.send("Error");
  }
});

app.listen(3000, () => console.log("Server running"));
