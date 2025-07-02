import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Star, Map, Calendar, Settings, Users, Plane } from "lucide-react";

const badges = [
  { id: 1, name: "Esploratore", description: "Visita 10 luoghi", icon: "🗺️", unlocked: true },
  { id: 2, name: "Fotografo", description: "Scatta 50 foto", icon: "📸", unlocked: true },
  { id: 3, name: "Avventuriero", description: "Completa 5 viaggi", icon: "🎒", unlocked: true },
  { id: 4, name: "Gourmet", description: "Prova 20 ristoranti", icon: "🍽️", unlocked: false },
  { id: 5, name: "Globetrotter", description: "Visita 10 paesi", icon: "🌍", unlocked: false },
  { id: 6, name: "Maratoneta", description: "Cammina 100km", icon: "👟", unlocked: false }
];

const stats = [
  { label: "Viaggi completati", value: "12", icon: Map },
  { label: "Luoghi visitati", value: "45", icon: Star },
  { label: "Giorni in viaggio", value: "89", icon: Calendar },
  { label: "Km percorsi", value: "2,456", icon: Plane }
];

const recentTrips = [
  { name: "Tour della Toscana", date: "Luglio 2024", status: "Completato", rating: 5 },
  { name: "Roma Antica", date: "Giugno 2024", status: "Completato", rating: 4 },
  { name: "Costiera Amalfitana", date: "Maggio 2024", status: "Completato", rating: 5 }
];

export default function Profile() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card-custom border-0">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <Avatar className="h-24 w-24 mx-auto lg:mx-0">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
              <AvatarFallback className="text-2xl bg-gradient-primary text-white">MR</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl font-bold mb-1">Marco Rossi</h1>
              <p className="text-muted-foreground mb-3">Viaggiatore appassionato dal 2020</p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  ⭐ Livello Esperto
                </Badge>
                <Badge variant="secondary">
                  🌍 12 Paesi visitati
                </Badge>
              </div>
            </div>

            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Modifica profilo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-card-custom border-0">
            <CardContent className="p-4 text-center">
              <div className="p-3 bg-gradient-primary rounded-xl w-fit mx-auto mb-3 shadow-travel">
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Level Progress */}
      <Card className="shadow-card-custom border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            Progressi Livello
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Livello Esperto</span>
              <span className="text-sm text-muted-foreground">2,450 / 3,000 XP</span>
            </div>
            <Progress value={(2450 / 3000) * 100} className="h-3" />
            <p className="text-sm text-muted-foreground">
              Ti mancano 550 XP per raggiungere il livello Maestro! 🏆
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card className="shadow-card-custom border-0">
        <CardHeader>
          <CardTitle>I tuoi badge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  badge.unlocked
                    ? "border-primary/20 bg-primary/5 shadow-card-custom"
                    : "border-muted bg-muted/30 opacity-60"
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h3 className="font-semibold text-sm">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                  {badge.unlocked && (
                    <Badge variant="secondary" className="mt-2 text-xs bg-secondary/20 text-secondary">
                      Sbloccato
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Trips */}
      <Card className="shadow-card-custom border-0">
        <CardHeader>
          <CardTitle>Viaggi recenti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTrips.map((trip, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div>
                  <h3 className="font-semibold">{trip.name}</h3>
                  <p className="text-sm text-muted-foreground">{trip.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < trip.rating ? "text-accent fill-current" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <Badge variant="secondary">{trip.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}