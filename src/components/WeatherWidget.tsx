import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Sun, CloudRain, Wind, Thermometer } from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
  }>;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    location: "Firenze, IT",
    temperature: 24,
    condition: "Soleggiato",
    humidity: 65,
    windSpeed: 12,
    forecast: [
      { day: "Dom", temp: 26, condition: "sunny" },
      { day: "Lun", temp: 23, condition: "cloudy" },
      { day: "Mar", temp: 21, condition: "rainy" },
      { day: "Mer", temp: 25, condition: "sunny" },
    ]
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'soleggiato':
        return <Sun className="h-8 w-8 text-accent" />;
      case 'cloudy':
      case 'nuvoloso':
        return <Cloud className="h-8 w-8 text-muted-foreground" />;
      case 'rainy':
      case 'piovoso':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-accent" />;
    }
  };

  return (
    <Card className="shadow-card-custom border-0 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getWeatherIcon(weather.condition)}
          Meteo - {weather.location}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-primary">{weather.temperature}°C</div>
              <div className="text-sm text-muted-foreground">{weather.condition}</div>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-1 text-sm">
                <Wind className="h-4 w-4" />
                <span>{weather.windSpeed} km/h</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Thermometer className="h-4 w-4" />
                <span>{weather.humidity}% umidità</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between gap-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center flex-1">
                <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
                <div className="mb-1">{getWeatherIcon(day.condition)}</div>
                <div className="text-sm font-medium">{day.temp}°</div>
              </div>
            ))}
          </div>
          
          <Badge variant="secondary" className="w-full justify-center bg-secondary/20 text-secondary">
            Perfetto per esplorare! ☀️
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}