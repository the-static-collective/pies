import { GoogleGenAI } from '@google/genai';
import type { ExtractionProposal, ProcessReflectionResponse } from '../src/types.js';

const SYSTEM_INSTRUCTION = `You are Paula's stewardship assistant helping arrange her spoken reflections after meal deliveries and community visits.

Your role is to propose an arrangement of her words into structured fields with strict fidelity and zero fabrication.

CRITICAL LAWS OF FIDELITY:
1. NEVER invent names, meal counts, needs, gifts, or dates that were not mentioned.
2. For every field, specify:
   - proposedValue: the value (or empty string/0 if not mentioned)
   - sourceExcerpt: exact substring from transcript that supports this field, or null if inferred/unknown
   - confidence: "explicit" (directly stated), "inferred" (reasonably derived), or "unknown" (not mentioned in reflection)
3. If no recipient name was given, proposedValue should be "Neighbor" with confidence "unknown".
4. If no meal count was explicitly stated, set meals_shared proposedValue to 0 with confidence "unknown".
5. Do not invent needs or gifts if none were spoken.
6. Provide a warm, respectful confirmationText summarizing what was heard in one simple sentence.

Respond STRICTLY in valid JSON adhering to the required schema:
{
  "recipient_name": { "proposedValue": string, "sourceExcerpt": string|null, "confidence": "explicit"|"inferred"|"unknown" },
  "meals_shared": { "proposedValue": number, "sourceExcerpt": string|null, "confidence": "explicit"|"inferred"|"unknown" },
  "occurredOn": { "proposedValue": string, "sourceExcerpt": string|null, "confidence": "explicit"|"inferred"|"unknown" },
  "life_event": { "proposedValue": string, "sourceExcerpt": string|null, "confidence": "explicit"|"inferred"|"unknown" },
  "expressed_need": { "proposedValue": string, "sourceExcerpt": string|null, "confidence": "explicit"|"inferred"|"unknown" },
  "offered_gift": { "proposedValue": string, "sourceExcerpt": string|null, "confidence": "explicit"|"inferred"|"unknown" },
  "recognition_note": { "proposedValue": string, "sourceExcerpt": string|null, "confidence": "explicit"|"inferred"|"unknown" },
  "confirmationText": string
}
`;

export async function processSpokenReflection(
  transcript: string,
  audioBase64?: string,
  mimeType: string = 'audio/webm'
): Promise<ProcessReflectionResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      rawTranscript: transcript || '',
      error: 'GEMINI_API_KEY is not configured in the environment.',
    };
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const contentsParts: any[] = [];

  if (audioBase64) {
    contentsParts.push({
      inlineData: {
        data: audioBase64,
        mimeType,
      },
    });
  }

  if (transcript && transcript.trim()) {
    contentsParts.push({
      text: `Paula's spoken reflection: "${transcript.trim()}"`,
    });
  } else if (!audioBase64) {
    return {
      success: false,
      rawTranscript: '',
      error: 'No audio or transcript provided.',
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts: contentsParts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    const parsed = JSON.parse(responseText);

    const todayStr = new Date().toISOString().split('T')[0];

    const proposal: ExtractionProposal = {
      proposalId: `prop-${Date.now()}`,
      recipient_name: {
        proposedValue: parsed.recipient_name?.proposedValue || 'Neighbor',
        sourceExcerpt: parsed.recipient_name?.sourceExcerpt || undefined,
        confidence: parsed.recipient_name?.confidence || 'unknown',
      },
      meals_shared: {
        proposedValue: Number(parsed.meals_shared?.proposedValue) || 0,
        sourceExcerpt: parsed.meals_shared?.sourceExcerpt || undefined,
        confidence: parsed.meals_shared?.confidence || 'unknown',
      },
      occurredOn: {
        proposedValue: parsed.occurredOn?.proposedValue || todayStr,
        sourceExcerpt: parsed.occurredOn?.sourceExcerpt || undefined,
        confidence: parsed.occurredOn?.confidence || 'inferred',
      },
      life_event: parsed.life_event?.proposedValue
        ? {
            proposedValue: parsed.life_event.proposedValue,
            sourceExcerpt: parsed.life_event.sourceExcerpt || undefined,
            confidence: parsed.life_event.confidence || 'inferred',
          }
        : undefined,
      expressed_need: parsed.expressed_need?.proposedValue
        ? {
            proposedValue: parsed.expressed_need.proposedValue,
            sourceExcerpt: parsed.expressed_need.sourceExcerpt || undefined,
            confidence: parsed.expressed_need.confidence || 'explicit',
          }
        : undefined,
      offered_gift: parsed.offered_gift?.proposedValue
        ? {
            proposedValue: parsed.offered_gift.proposedValue,
            sourceExcerpt: parsed.offered_gift.sourceExcerpt || undefined,
            confidence: parsed.offered_gift.confidence || 'explicit',
          }
        : undefined,
      recognition_note: {
        proposedValue: parsed.recognition_note?.proposedValue || transcript.trim(),
        sourceExcerpt: parsed.recognition_note?.sourceExcerpt || undefined,
        confidence: parsed.recognition_note?.confidence || 'explicit',
      },
      rawTranscript: transcript,
      createdAt: new Date().toISOString(),
      confirmationText: parsed.confirmationText || 'Arranged from Paula’s reflection.',
    };

    return {
      success: true,
      proposal,
      rawTranscript: transcript,
    };
  } catch (err: any) {
    console.error('Gemini Extraction Error:', err);
    // ABSOLUTE LAW 1: NO FABRICATED LOCAL FALLBACK! Preserve raw transcript and report error.
    return {
      success: false,
      rawTranscript: transcript,
      error: err?.message || 'Could not reach Gemini service to format reflection proposal.',
    };
  }
}
