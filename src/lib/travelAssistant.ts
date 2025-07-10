import { GeminiMessage, generateGeminiResponse } from "./gemini";

export async function callTravelAssistant(message: string, conversation: GeminiMessage[] = []): Promise<string> {
  const messages: GeminiMessage[] = [
    ...conversation,
    { role: 'user', content: message }
  ];
  return generateGeminiResponse(messages);
}
