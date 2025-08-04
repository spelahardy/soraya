import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'; // ✅ ← THIS IS CRUCIAL

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log("🔑 Loaded OpenAI Key:", OPENAI_API_KEY ? "Yes" : "No");

app.post('/api/message', async (req, res) => {
  const { message } = req.body;
  console.log("📩 Incoming message:", message);

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are Soraya, a gentle emotional support companion. Speak calmly, listen deeply, and comfort like a poetic friend. Never give advice or diagnose.',
          },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await openaiRes.json();
    console.log("📦 Raw OpenAI response:", JSON.stringify(data, null, 2));

    if (!data.choices) {
      console.log("❌ No choices received from OpenAI:", JSON.stringify(data, null, 2));
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || "I'm still listening.";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Error talking to OpenAI:", err);
    res.status(500).json({
      reply: "I'm having trouble thinking right now, but I'm still with you.",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Soraya server is running on port ${PORT}`);
});
