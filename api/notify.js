export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { slack_user_id, message } = req.body;

  if (!slack_user_id || !message) {
    return res.status(400).json({ error: "Missing slack_user_id or message" });
  }

  try {
    const slackResp = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SLACK_BOT_TOKEN}`
      }
      body: JSON.stringify({
        channel: slack_user_id,
        text: message
      })
    });

    const data = await slackResp.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error("Slack error:", err);
    return res.status(500).json({ error: "Failed to send Slack message" });
  }
}

