import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const FLASH_MODEL = 'gemini-2.0-flash-exp';
const THINKING_MODEL = 'gemini-2.0-flash-thinking-exp-01-21';

export interface ChatRequest {
  message: string;
  context: {
    files: { name: string; content: string }[];
  };
}

export async function generateResponse(req: ChatRequest) {
  // First use the thinking model to determine if we need complex reasoning
  const thinkingModel = genAI.getGenerativeModel({ model: THINKING_MODEL });
  const thinkingResponse = await thinkingModel.generateContent({
    contents: [{
      role: 'user',
      parts: [{
        text: `Analyze this request and determine if it needs complex reasoning: "${req.message}"
        Context files: ${req.context.files.map(f => f.name).join(', ')}

        Reply with NEEDS_REASONING or SIMPLE_RESPONSE`
      }]
    }]
  });

  const result = await thinkingResponse.response;
  const needsReasoning = result.text().includes('NEEDS_REASONING');

  // Build context string from files
  const contextStr = req.context.files.map(f => 
    `File: ${f.name}\n${f.content}\n---\n`
  ).join('\n');

  if (needsReasoning) {
    // Use thinking model for complex reasoning
    const response = await thinkingModel.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `Context:\n${contextStr}\n\nUser question: ${req.message}`
        }]
      }],
      generationConfig: { 
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    const result = await response.response;
    const text = result.text();
    const parts = text.split('Thinking:');
    return {
      content: parts[parts.length - 1].trim(),
      thinking: parts.length > 1 ? parts[0].trim() : undefined,
    };
  } else {
    // Use flash model for simpler responses
    const flashModel = genAI.getGenerativeModel({ model: FLASH_MODEL });
    const response = await flashModel.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `Context:\n${contextStr}\n\nUser question: ${req.message}`
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      }
    });

    const result = await response.response;
    return {
      content: result.text(),
    };
  }
}