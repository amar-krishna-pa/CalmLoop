'use client';

import { useState } from 'react';

export default function Chat() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    setResponse('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const reader = res.body?.getReader();

    if (!reader) {
      setLoading(false);
      return;
    }

    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      setResponse(prev => prev + chunk);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-6 flex justify-between">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 border rounded p-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="border rounded px-4 py-2"
        >
          Send
        </button>
      </form>

      <div className="mt-6 whitespace-pre-wrap">
        {response}
      </div>
    </div>
  );
}