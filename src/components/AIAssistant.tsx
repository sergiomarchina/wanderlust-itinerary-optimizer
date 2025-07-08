import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bot, Send, Loader2 } from "lucide-react";
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
      content: 'Ciao! Sono il tuo assistente AI per i viaggi. Posso aiutarti a pianificare il tuo itinerario, suggerire luoghi da visitare e ottimizzare i tuoi percorsi. Come posso aiutarti oggi?'
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
      // Simulated AI response - in production this would call an actual AI service
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      const responses = [
        "Ottima domanda! Basandomi sui tuoi interessi, ti consiglio di visitare...",
        "Per ottimizzare il tuo itinerario, suggerisco di raggruppare le attrazioni per zona...",
        "Ho trovato alcuni luoghi interessanti nelle vicinanze che potresti aggiungere...",
        "Per quella destinazione, il periodo migliore per visitarla è...",
        "Ti consiglio di prenotare in anticipo per evitare code lunghe...",
        "Basandomi sulle recensioni recenti, questo posto è molto apprezzato per...",
        "Per il trasporto, la soluzione più efficiente sarebbe...",
        "Ho alcune raccomandazioni per ristoranti locali autentici..."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: randomResponse + " " + userMessage.toLowerCase().includes('dove') ? 
          "Posso anche cercare informazioni specifiche su Google Maps se me lo chiedi!" : 
          "Vuoi che cerchi informazioni più dettagliate?" 
      }]);
      
    } catch (error) {
      toast.error('Errore nel contattare l\'assistente AI');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Mi dispiace, al momento non riesco a rispondere. Riprova tra poco!' 
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
          className="fixed bottom-6 right-6 rounded-full shadow-travel z-50"
        >
          <Bot className="mr-2 h-5 w-5" />
          Assistente AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Assistente AI per Viaggi
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
                  <p className="text-sm">L'assistente sta pensando...</p>
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
              placeholder="Chiedi consigli per il tuo viaggio..."
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