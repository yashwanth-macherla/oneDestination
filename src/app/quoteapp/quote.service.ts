import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';
import { environment } from '../../environments/environments';

export type QuoteCategory = 'motivation' | 'inspiration' | 'comedy' | 'funny';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private readonly apiKey = environment.openaiApiKey;
  private readonly model = 'llama-3.1-8b-instant';

  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  constructor(private http: HttpClient) {}

  async generateQuote(category: QuoteCategory, topic?: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Please set your Groq API key in src/environments/environment.ts.');
    }

    const systemMessage = `
You are a professional quote writer.
Return exactly ONE short, original quote.

Rules:
- Language: simple, conversational English.
- Length: at most 20 words.
- Match the requested category and relate clearly to the topic (if any).
- Avoid generic clichés (no "never give up", "believe in yourself", etc.).
- No vulgarity, no hate, no dark humor, no politics, no religion, no adult content.
- Output ONLY the quote text itself:
  - no quotation marks
  - no author name
  - no explanations or labels.

If the category suggests humor, keep it light and family safe.
    `.trim();

    const userMessage = `
Category: ${category}
Topic/context: ${topic ?? 'general'}

Write ONE quote that follows all the rules.
    `.trim();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    }); 

    const body = {
      model: this.model,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 60,
      temperature: 0.9
    };

    try {
      const response = await firstValueFrom(
        this.http.post<any>(this.apiUrl, body, { headers }).pipe(
          map(res => {
            const raw: string =
              res?.choices?.[0]?.message?.content?.toString()?.trim() ?? '';

            if (!raw) {
              throw new Error('Empty response from Groq.');
            }

            // Strip any leading/trailing quotes the model might add
            let cleaned = raw.replace(/^["'“”‘’]+/, '').replace(/["'“”‘’]+$/, '').trim();

            // Enforce max 20 words
            const words = cleaned.split(/\s+/).filter(Boolean);
            if (words.length > 20) {
              cleaned = words.slice(0, 20).join(' ');
            }

            return cleaned;
          })
        )
      );

      return response;
    } catch (error: any) {
      console.error('Groq error:', error);
      const msg =
        error?.error?.error?.message ||
        error?.message ||
        'Failed to reach Groq. Check your API key & connection.';
      throw new Error(msg);
    }
  }
}
