export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { question } = req.body;

  const ARTICLES = [
    {
      title: "Článek 1",
      content: "Sem vlož obsah prvního článku..."
    },
    {
      title: "Článek 2",
      content: "Sem vlož obsah druhého článku..."
    }
  ];

  // jednoduché hledání podle klíčového slova
  const relevant = ARTICLES.find(a =>
    a.content.toLowerCase().includes(question.toLowerCase())
  );

  const context = relevant ? relevant.content : "Nenalezen relevantní článek.";

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: "Odpovídej pouze z tohoto textu:\n" + context },
              { text: question }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();

  res.status(200).json({
    answer: data.candidates?.[0]?.content?.parts?.[0]?.text || "Bez odpovědi"
  });
}
