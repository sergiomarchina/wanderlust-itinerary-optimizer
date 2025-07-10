import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bot, Send, Loader2, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { generateGeminiResponse, GeminiMessage } from "@/lib/gemini";
import { callTravelAssistant } from "@/lib/travelAssistant";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Ciao! Sono TravelBot, il tuo assistente AI specializzato in viaggi! 🌍 Posso aiutarti a pianificare itinerari, suggerire luoghi da visitare, consigliarti sui trasporti e molto altro. Dimmi, che tipo di viaggio stai pianificando?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const aiReply = await callTravelAssistant(userMessage, messages);

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: aiReply || 'Mi dispiace, non ho una risposta al momento.' }
      ]);

    } catch (error) {
      console.error('Error contacting AI assistant:', error);

      // Gemini fallback if API key is provided
      if (import.meta.env.VITE_GEMINI_API_KEY) {
        try {
          const prompt: GeminiMessage[] = [
            ...messages,
            { role: 'user', content: userMessage }
          ];
          const geminiReply = await generateGeminiResponse(prompt);
          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: geminiReply || 'Mi dispiace, non ho una risposta al momento.' }
          ]);
          return;
        } catch (fallbackError) {
          console.error('Gemini fallback failed:', fallbackError);
        }
      }

      toast.error('Errore nel contattare l\'assistente AI');

      // Provide a helpful fallback response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Mi dispiace, al momento non riesco a connettermi ai miei servizi AI. Tuttavia posso comunque aiutarti con consigli di base! Prova a essere più specifico sulla tua destinazione o su cosa stai cercando. 🗺️'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="gradient" 
          size="lg" 
          className="fixed bottom-20 right-6 rounded-full shadow-travel z-[9999]"
        >
          <Bot className="mr-2 h-5 w-5" />
          TravelBot AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            TravelBot - Assistente AI per Viaggi
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[500px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-lg">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border p-3 rounded-lg flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">TravelBot sta elaborando la risposta...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2 mt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Es: 'Consigli per 3 giorni a Roma' o 'Migliori ristoranti a Firenze'"
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}