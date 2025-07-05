import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const categories = [
  { value: "transport", label: "Trasporti", icon: "🚗" },
  { value: "food", label: "Cibo", icon: "🍽️" },
  { value: "accommodation", label: "Alloggio", icon: "🏨" },
  { value: "activities", label: "Attività", icon: "🎯" },
  { value: "shopping", label: "Shopping", icon: "🛍️" },
  { value: "other", label: "Altro", icon: "💰" }
];

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", amount: 45.50, category: "food", description: "Pranzo al ristorante", date: "2024-07-15" },
    { id: "2", amount: 120.00, category: "accommodation", description: "Hotel 1 notte", date: "2024-07-15" },
    { id: "3", amount: 25.00, category: "transport", description: "Taxi aeroporto", date: "2024-07-15" },
  ]);
  
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    description: ""
  });
  
  const [isOpen, setIsOpen] = useState(false);
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budgetLimit = 500; // Example budget
  const budgetPercentage = (totalExpenses / budgetLimit) * 100;

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.category || !newExpense.description) {
      toast.error("Compila tutti i campi");
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({ amount: "", category: "", description: "" });
    setIsOpen(false);
    toast.success("Spesa aggiunta con successo!");
  };

  const getCategoryIcon = (category: string) => {
    return categories.find(cat => cat.value === category)?.icon || "💰";
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(cat => cat.value === category)?.label || "Altro";
  };

  return (
    <Card className="shadow-card-custom border-0 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Spese Viaggio
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="gradient">
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuova Spesa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Importo (€)"
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  />
                </div>
                <div>
                  <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input
                    placeholder="Descrizione"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  />
                </div>
                <Button onClick={addExpense} className="w-full">
                  Aggiungi Spesa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Budget Overview */}
          <div className="p-4 rounded-lg bg-gradient-subtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Budget utilizzato</span>
              <span className="text-lg font-bold text-primary">€{totalExpenses.toFixed(2)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  budgetPercentage > 80 ? 'bg-destructive' : 'bg-gradient-primary'
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>€0</span>
              <span>Budget: €{budgetLimit}</span>
            </div>
            {budgetPercentage > 80 && (
              <Badge variant="destructive" className="mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                Attenzione al budget!
              </Badge>
            )}
          </div>

          {/* Recent Expenses */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Spese recenti</h4>
            {expenses.slice(0, 3).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                  <div>
                    <div className="font-medium text-sm">{expense.description}</div>
                    <div className="text-xs text-muted-foreground">{getCategoryLabel(expense.category)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">€{expense.amount.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">{expense.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}