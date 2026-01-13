export default async function handler(req, res) {
  try {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const accessToken = process.env.TWITCH_ACCESS_TOKEN;

    if (!clientId || !accessToken) {
      return res.status(500).json({ error: "Twitch env vars not set" });
    }

    const response = await fetch(
      "https://api.twitch.tv/helix/streams?first=10",
      {
        headers: {
          "Client-ID": clientId,
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    res.status(200).json(data.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
