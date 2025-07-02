import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Map, Calendar, Navigation as NavigationIcon, Settings, Users, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/", label: "Dashboard", icon: Map },
  { href: "/itinerary", label: "Itinerario", icon: Calendar },
  { href: "/discover", label: "Scopri", icon: NavigationIcon },
  { href: "/profile", label: "Profilo", icon: Users },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border/50">
      <div className="flex items-center justify-around h-16 px-4">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300",
                isActive
                  ? "text-primary bg-primary/10 scale-110"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export function DesktopNavigation() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow pt-6 bg-card border-r border-border">
        <div className="flex items-center flex-shrink-0 px-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-hero rounded-xl shadow-travel">
              <NavigationIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              TravelMate
            </h1>
          </div>
        </div>
        
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-gradient-primary text-white shadow-travel"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}