import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Layers, 
  AlertTriangle, 
  TrendingUp,
  Filter,
  Activity,
  Users,
  MessageSquare,
  OctagonX
} from "lucide-react";

const riskZones = [
  {
    id: 1,
    name: "Dharavi, Mumbai",
    coords: [19.0430, 72.8570],
    riskLevel: "critical",
    alerts: 156,
    activeUsers: 89,
    recentActivity: "3 min ago",
    description: "High concentration of drug trafficking activities"
  },
  {
    id: 2,
    name: "Karol Bagh, Delhi",
    coords: [28.6519, 77.1910],
    riskLevel: "high",
    alerts: 98,
    activeUsers: 67,
    recentActivity: "8 min ago",
    description: "Emerging drug distribution network detected"
  },
  {
    id: 3,
    name: "Commercial Street, Bengaluru",
    coords: [12.9716, 77.5946],
    riskLevel: "high",
    alerts: 78,
    activeUsers: 45,
    recentActivity: "12 min ago",
    description: "Party drug supply chain identified"
  },
  {
    id: 4,
    name: "T. Nagar, Chennai",
    coords: [13.0418, 80.2341],
    riskLevel: "medium",
    alerts: 34,
    activeUsers: 23,
    recentActivity: "25 min ago",
    description: "Suspicious messaging patterns observed"
  },
  {
    id: 5,
    name: "Sector 17, Chandigarh",
    coords: [30.7400, 76.7800],
    riskLevel: "medium",
    alerts: 28,
    activeUsers: 19,
    recentActivity: "1 hour ago",
    description: "Cannabis distribution monitoring"
  }
];

const heatmapData = [
  { region: "Mumbai Metropolitan", intensity: 94, color: "#ef4444" },
  { region: "Delhi NCR", intensity: 87, color: "#f97316" },
  { region: "Bengaluru Urban", intensity: 76, color: "#f59e0b" },
  { region: "Chennai Metropolitan", intensity: 45, color: "#eab308" },
  { region: "Pune Metropolitan", intensity: 38, color: "#84cc16" },
  { region: "Hyderabad Metropolitan", intensity: 32, color: "#22c55e" }
];

export default function RiskMap() {
  const [viewMode, setViewMode] = useState<"heatmap" | "pinpoint">("pinpoint");
  const [selectedZone, setSelectedZone] = useState(riskZones[0]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "text-destructive";
      case "high": return "text-warning";
      case "medium": return "text-warning opacity-75";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "critical": return "destructive";
      case "high": return "secondary";
      case "medium": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Risk Map</h1>
          <p className="text-muted-foreground">Geographic distribution of drug trafficking activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "pinpoint" ? "default" : "outline"}
            onClick={() => setViewMode("pinpoint")}
            size="sm"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Pinpoint View
          </Button>
          <Button
            variant={viewMode === "heatmap" ? "default" : "outline"}
            onClick={() => setViewMode("heatmap")}
            size="sm"
          >
            <Layers className="h-4 w-4 mr-2" />
            Heatmap View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <div className="lg:col-span-2">
          <Card className="cyber-border h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                Interactive Risk Map
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              {/* Simulated Map Interface */}
              <div className="relative w-full h-full bg-muted/20 rounded-lg border border-border overflow-hidden">
                {/* Map Controls */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <Button size="sm" variant="outline" className="w-8 h-8 p-0">+</Button>
                  <Button size="sm" variant="outline" className="w-8 h-8 p-0">-</Button>
                  <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                {/* Simulated Map Background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 via-background to-accent/20"></div>
                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-30"
                       style={{
                         backgroundImage: `
                           linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                         `,
                         backgroundSize: "50px 50px"
                       }}>
                  </div>
                </div>

                {/* Risk Zone Markers */}
                {viewMode === "pinpoint" && riskZones.map((zone, index) => (
                  <div
                    key={zone.id}
                    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                      selectedZone.id === zone.id ? "scale-125" : ""
                    }`}
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 12}%`
                    }}
                    onClick={() => setSelectedZone(zone)}
                  >
                    <div className={`relative ${
                      zone.riskLevel === "critical" ? "risk-glow" :
                      zone.riskLevel === "high" ? "warning-glow" : ""
                    }`}>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        zone.riskLevel === "critical" ? "bg-destructive border-destructive" :
                        zone.riskLevel === "high" ? "bg-warning border-warning" :
                        "bg-success border-success"
                      }`}>
                        <OctagonX className="h-3 w-3 text-white" />
                      </div>
                      {/* Pulse animation */}
                      <div className={`absolute inset-0 w-6 h-6 rounded-full animate-ping ${
                        zone.riskLevel === "critical" ? "bg-destructive" :
                        zone.riskLevel === "high" ? "bg-warning" :
                        "bg-success"
                      } opacity-30`}></div>
                    </div>
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded px-2 py-1 text-xs whitespace-nowrap">
                      {zone.name}
                    </div>
                  </div>
                ))}

                {/* Heatmap Overlay */}
                {viewMode === "heatmap" && (
                  <div className="absolute inset-0">
                    {heatmapData.map((area, index) => (
                      <div
                        key={area.region}
                        className="absolute rounded-full opacity-60 animate-pulse"
                        style={{
                          left: `${15 + index * 14}%`,
                          top: `${25 + index * 10}%`,
                          width: `${area.intensity}px`,
                          height: `${area.intensity}px`,
                          backgroundColor: area.color,
                          filter: "blur(8px)"
                        }}
                      ></div>
                    ))}
                  </div>
                )}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-card/90 border border-border rounded-lg p-3">
                  <h4 className="text-sm font-medium text-foreground mb-2">Risk Levels</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <span className="text-xs text-foreground">Critical</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-warning"></div>
                      <span className="text-xs text-foreground">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <span className="text-xs text-foreground">Medium/Low</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone Details & Statistics */}
        <div className="space-y-6">
          {/* Selected Zone Details */}
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-foreground">Zone Details</span>
                <Badge 
                  variant={getRiskBadgeVariant(selectedZone.riskLevel)}
                  className={selectedZone.riskLevel === "critical" ? "risk-glow" : ""}
                >
                  {selectedZone.riskLevel.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground">{selectedZone.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedZone.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-xl font-bold text-foreground">{selectedZone.alerts}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Alerts</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4 text-warning" />
                    <span className="text-xl font-bold text-foreground">{selectedZone.activeUsers}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Active Users</p>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-success" />
                  <span className="text-sm text-foreground">Last Activity: {selectedZone.recentActivity}</span>
                </div>
              </div>

              <Button className="w-full" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                View Zone Reports
              </Button>
            </CardContent>
          </Card>

          {/* Regional Statistics */}
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                Regional Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="alerts" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                </TabsList>
                
                <TabsContent value="alerts" className="space-y-3 mt-4">
                  {riskZones.slice(0, 3).map((zone) => (
                    <div key={zone.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div>
                        <p className="text-sm font-medium text-foreground">{zone.name.split(',')[0]}</p>
                        <p className="text-xs text-muted-foreground">{zone.alerts} alerts</p>
                      </div>
                      <Badge variant="outline" className={getRiskColor(zone.riskLevel)}>
                        {zone.riskLevel}
                      </Badge>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="trends" className="space-y-3 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">24h Change</span>
                      <span className="text-destructive">+12%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">7d Average</span>
                      <span className="text-warning">+8.4%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Peak Hours</span>
                      <span className="text-foreground">22:00-02:00</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}