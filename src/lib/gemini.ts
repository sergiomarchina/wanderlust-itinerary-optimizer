export interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateGeminiResponse(messages: GeminiMessage[]): Promise<string> {
  if (!API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

  const body = {
    contents: messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }))
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}
