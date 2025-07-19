import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Users,
  MapPin,
  AlertTriangle,
  Settings,
  ChevronLeft,
  Shield,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Scan Results", href: "/scan-results", icon: Search },
  { name: "User Metadata", href: "/user-metadata", icon: Users },
  { name: "Risk Map", href: "/risk-map", icon: MapPin },
  { name: "Alert Log", href: "/alert-log", icon: AlertTriangle },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const location = useLocation();

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-card border-r border-border cyber-border transition-all duration-300 z-50",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-foreground">CyberWatch</h1>
              <p className="text-xs text-muted-foreground">Drug Enforcement</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform duration-300",
            collapsed && "rotate-180"
          )} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                "hover:bg-muted hover:text-foreground",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "text-muted-foreground",
                collapsed && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Status Indicator */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-muted/50 rounded-lg p-3 border border-border">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-success animate-pulse" />
              <span className="text-sm text-foreground">System Active</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Real-time monitoring enabled
            </p>
          </div>
        </div>
      )}
    </div>
  );
}