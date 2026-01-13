export default async function handler(req, res) {
  try {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: "Twitch env vars not set" });
    }

    // 1️⃣ Gerar token OAuth
    const tokenRes = await fetch(
      "https://id.twitch.tv/oauth2/token" +
        `?client_id=${clientId}` +
        `&client_secret=${clientSecret}` +
        "&grant_type=client_credentials",
      { method: "POST" }
    );

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return res.status(500).json({ error: "Failed to get Twitch token" });
    }

    // 2️⃣ Buscar streams AO VIVO
    const twitchRes = await fetch(
      "https://api.twitch.tv/helix/streams?first=10",
      {
        headers: {
          "Client-ID": clientId,
          "Authorization": `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const data = await twitchRes.json();
    res.status(200).json(data.data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
