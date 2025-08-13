import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Icon, LatLngTuple } from "leaflet";
import { OctagonX, AlertTriangle, Clock, Filter, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// Mock data for risk zones
const riskZones = [
  {
    id: 1,
    position: [19.0760, 72.8777] as LatLngTuple, // Mumbai
    severity: "critical",
    alertCount: 89,
    description: "High drug trafficking activity detected",
    timestamp: "2024-01-15 14:30:00",
    platform: "Multiple",
  },
  {
    id: 2,
    position: [28.6139, 77.2090] as LatLngTuple, // Delhi
    severity: "high",
    alertCount: 76,
    description: "Suspicious communication patterns",
    timestamp: "2024-01-15 13:45:00",
    platform: "Telegram",
  },
  {
    id: 3,
    position: [12.9716, 77.5946] as LatLngTuple, // Bangalore
    severity: "medium",
    alertCount: 52,
    description: "Increased coded language usage",
    timestamp: "2024-01-15 12:20:00",
    platform: "WhatsApp",
  },
  {
    id: 4,
    position: [13.0827, 80.2707] as LatLngTuple, // Chennai
    severity: "medium",
    alertCount: 34,
    description: "Network expansion detected",
    timestamp: "2024-01-15 11:15:00",
    platform: "Instagram",
  },
  {
    id: 5,
    position: [22.5726, 88.3639] as LatLngTuple, // Kolkata
    severity: "low",
    alertCount: 28,
    description: "Routine monitoring activity",
    timestamp: "2024-01-15 10:30:00",
    platform: "Telegram",
  },
];

const createCustomIcon = (severity: string) => {
  const color = 
    severity === "critical" ? "#ef4444" :
    severity === "high" ? "#f97316" :
    severity === "medium" ? "#eab308" : "#3b82f6";
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="${color}" opacity="0.8" stroke="#fff" stroke-width="2"/>
        <circle cx="16" cy="16" r="6" fill="${color}" opacity="0.9"/>
        <text x="16" y="20" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">!</text>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export function EnhancedRiskMap() {
  const [timeFilter, setTimeFilter] = useState("24h");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [mapView, setMapView] = useState<"heatmap" | "pinpoint">("pinpoint");
  const [timelineValue, setTimelineValue] = useState([24]);

  const filteredZones = riskZones.filter(zone => {
    if (severityFilter !== "all" && zone.severity !== severityFilter) return false;
    // Add time filtering logic here
    return true;
  });

  const getCircleRadius = (alertCount: number) => {
    return Math.min(alertCount * 500, 50000); // Scale radius based on alert count
  };

  const getCircleColor = (severity: string) => {
    switch (severity) {
      case "critical": return "#ef4444";
      case "high": return "#f97316";
      case "medium": return "#eab308";
      default: return "#3b82f6";
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-muted/30 border"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-32">
            <Clock className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-32">
            <AlertTriangle className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button 
            variant={mapView === "pinpoint" ? "default" : "outline"}
            size="sm"
            onClick={() => setMapView("pinpoint")}
          >
            Pinpoint View
          </Button>
          <Button 
            variant={mapView === "heatmap" ? "default" : "outline"}
            size="sm"
            onClick={() => setMapView("heatmap")}
          >
            Heatmap View
          </Button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">Timeline (hours):</span>
          <div className="w-32">
            <Slider
              value={timelineValue}
              onValueChange={setTimelineValue}
              max={168}
              min={1}
              step={1}
            />
          </div>
          <span className="text-sm text-muted-foreground">{timelineValue[0]}h</span>
        </div>
      </motion.div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="cyber-border overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <OctagonX className="w-5 h-5 text-destructive" />
              Real-Time Risk Map
              <Badge variant="outline" className="ml-auto">
                {filteredZones.length} active zones
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[600px] relative">
              <div className="h-full bg-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed border-muted">
                <div className="text-center">
                  <OctagonX className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Enhanced Interactive Map</p>
                  <p className="text-muted-foreground">Real-time geographic visualization with Leaflet integration</p>
                  <p className="text-sm text-muted-foreground mt-2">Advanced mapping features would be implemented here</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">
              {filteredZones.filter(z => z.severity === "critical").length}
            </div>
            <p className="text-sm text-muted-foreground">Critical Zones</p>
          </CardContent>
        </Card>

        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-500">
              {filteredZones.filter(z => z.severity === "high").length}
            </div>
            <p className="text-sm text-muted-foreground">High Risk Zones</p>
          </CardContent>
        </Card>

        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {filteredZones.reduce((sum, zone) => sum + zone.alertCount, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Alerts</p>
          </CardContent>
        </Card>

        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">
              {Math.round(filteredZones.reduce((sum, zone) => sum + zone.alertCount, 0) / filteredZones.length)}
            </div>
            <p className="text-sm text-muted-foreground">Avg per Zone</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}