import type { ProcessReflectionResponse } from '../types';

export async function sendReflectionToGemini(
  transcript: string,
  audioBase64?: string,
  mimeType?: string
): Promise<ProcessReflectionResponse> {
  const response = await fetch('/api/record-encounter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transcript,
      audioBase64,
      mimeType,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server returned error ${response.status}`);
  }

  return response.json();
}
