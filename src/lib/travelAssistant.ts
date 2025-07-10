import { supabase } from "@/integrations/supabase/client";

export interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Calls the hosted `travel-assistant` Edge Function.
 * @param message The latest user message
 * @param conversation Optional prior messages for context
 * @returns The assistant's reply text
 */
export async function callTravelAssistant(message: string, conversation: AssistantMessage[] = []): Promise<string> {
  const { data, error } = await supabase.functions.invoke('travel-assistant', {
    body: { message, conversation }
  });

  if (error) {
    throw error;
  }

  return (data as any)?.response ?? '';
}
