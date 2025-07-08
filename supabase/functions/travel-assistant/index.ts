import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversation = [] } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // System prompt specialized for travel assistance
    const systemPrompt = `Sei un assistente AI specializzato in viaggi e itinerari. Il tuo nome è TravelBot e lavori per un'app di pianificazione viaggi chiamata Wanderlust.

COMPETENZE:
- Pianificazione itinerari dettagliati
- Consigli su destinazioni, attrazioni, ristoranti
- Informazioni su trasporti e logistica
- Suggerimenti su budget e costi
- Consigli stagionali e meteo
- Cultura locale e tradizioni
- Sicurezza e documenti di viaggio

STILE DI RISPOSTA:
- Entusiasta ma professionale
- Risposte dettagliate ma concise
- Suggerimenti pratici e actionable
- Sempre in italiano
- Includi emoji occasionali per rendere le risposte più vivaci

FUNZIONALITÀ SPECIALI:
- Puoi suggerire modifiche all'itinerario dell'utente
- Puoi consigliare orari ottimali per visitare luoghi
- Puoi stimare durate e costi
- Puoi suggerire alternative in base al meteo o stagionalità

Rispondi sempre in modo utile e cerca di essere specifico nei tuoi consigli.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in travel-assistant function:', error);
    
    // Fallback response if AI fails
    const fallbackResponses = [
      "Mi dispiace, al momento sto avendo difficoltà tecniche. Tuttavia posso comunque aiutarti! Che tipo di viaggio stai pianificando? 🗺️",
      "C'è un piccolo problema con la connessione, ma sono qui per aiutarti! Dimmi la tua destinazione e ti darò alcuni consigli utili! ✈️",
      "Al momento non riesco ad accedere a tutte le mie funzionalità, ma posso comunque fornirti consigli di base. Cosa vorresti sapere sul tuo viaggio? 🧳"
    ];
    
    const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return new Response(JSON.stringify({ 
      response: fallbackResponse,
      success: false,
      error: error.message 
    }), {
      status: 200, // Return 200 to avoid frontend errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});