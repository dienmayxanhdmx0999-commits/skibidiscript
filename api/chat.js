export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { modelTier, messages, temperature } = req.body;
  const apiKey = process.env.NOX_AI_API_KEY;
  const apiUrl = process.env.NOX_AI_API_URL || '[https://api.xkiro.com/v1/chat/completions](https://api.xkiro.com/v1/chat/completions)';

  if (!apiKey) {
    return res.status(500).json({ error: 'Server AI Gateway API key is not configured.' });
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v4-pro',
        messages: messages || [],
        temperature: temperature || 0.6
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal AI Gateway Error' });
  }
}
