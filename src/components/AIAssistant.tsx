import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bot, Send, Loader2, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

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
      // Call the Supabase Edge Function for AI response
      const response = await fetch('https://zctpvjfrbstoftxjowfd.supabase.co/functions/v1/travel-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdHB2amZyYnN0b2Z0eGpvd2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjI0ODMsImV4cCI6MjA2NzAzODQ4M30.5HgTLEmkGLPx-hB82tB94fIIqANFoZvHAcGr8u3CGTo`
        },
        body: JSON.stringify({
          message: userMessage,
          conversation: messages.slice(1) // Exclude initial greeting
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response 
        }]);
      } else {
        // Use fallback response if AI service fails
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response || 'Mi dispiace, al momento sto avendo difficoltà tecniche. Puoi riprovare tra poco!' 
        }]);
        
        if (data.error) {
          console.error('AI Assistant Error:', data.error);
        }
      }
      
    } catch (error) {
      console.error('Error contacting AI assistant:', error);
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