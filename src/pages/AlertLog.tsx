import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  User, 
  Filter,
  Pause,
  Play,
  Download,
  Bell,
  Activity,
  ExternalLink,
  RotateCcw,
  CheckCircle,
  XCircle,
  Circle
} from "lucide-react";

interface Alert {
  id: string;
  timestamp: string;
  platform: string;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  message: string;
  user: string;
  location: string;
  confidence: number;
  status: "new" | "acknowledged" | "investigating" | "resolved";
}

const initialAlerts: Alert[] = [
  {
    id: "ALT-001",
    timestamp: "2024-01-15 15:42:15",
    platform: "Telegram",
    severity: "critical",
    type: "Drug Code Detection",
    message: "High-confidence detection of 'ice' referring to methamphetamine",
    user: "@supplier_north",
    location: "Delhi, NCR",
    confidence: 96,
    status: "new"
  },
  {
    id: "ALT-002",
    timestamp: "2024-01-15 15:41:33",
    platform: "Instagram",
    severity: "high",
    type: "Payment Pattern",
    message: "Suspicious cryptocurrency transaction pattern detected",
    user: "@crypto_dealer_bom",
    location: "Mumbai, Maharashtra",
    confidence: 89,
    status: "new"
  },
  {
    id: "ALT-003",
    timestamp: "2024-01-15 15:40:08",
    platform: "WhatsApp",
    severity: "high",
    type: "Network Analysis",
    message: "New connection established with known drug trafficking network",
    user: "+91-98XXX-XXX21",
    location: "Bengaluru, Karnataka",
    confidence: 92,
    status: "acknowledged"
  },
  {
    id: "ALT-004",
    timestamp: "2024-01-15 15:38:45",
    platform: "Telegram",
    severity: "medium",
    type: "Behavioral Pattern",
    message: "Unusual messaging frequency spike detected",
    user: "@party_connect",
    location: "Pune, Maharashtra",
    confidence: 78,
    status: "investigating"
  },
  {
    id: "ALT-005",
    timestamp: "2024-01-15 15:37:22",
    platform: "Instagram",
    severity: "critical",
    type: "Drug Code Detection",
    message: "Multiple drug terms detected in single post: 'white', 'powder', 'delivery'",
    user: "@weekend_supply",
    location: "Chennai, Tamil Nadu",
    confidence: 94,
    status: "new"
  }
];

export default function AlertLog() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [isLive, setIsLive] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  // Simulate real-time alerts
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: `ALT-${String(alerts.length + Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
        platform: ["Telegram", "Instagram", "WhatsApp"][Math.floor(Math.random() * 3)],
        severity: ["critical", "high", "medium", "low"][Math.floor(Math.random() * 4)] as Alert["severity"],
        type: ["Drug Code Detection", "Payment Pattern", "Network Analysis", "Behavioral Pattern"][Math.floor(Math.random() * 4)],
        message: [
          "Suspicious keyword 'snow' detected in private message",
          "Encrypted file transfer with known dealer",
          "Location spoofing attempt detected",
          "Bulk messaging pattern indicates distribution activity"
        ][Math.floor(Math.random() * 4)],
        user: ["@new_supplier", "@crypto_user", "+91-9XXXX-XXX23", "@party_dealer"][Math.floor(Math.random() * 4)],
        location: ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Pune"][Math.floor(Math.random() * 5)],
        confidence: Math.floor(Math.random() * 30) + 70,
        status: "new"
      };

      setAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep last 50 alerts
    }, 8000); // New alert every 8 seconds

    return () => clearInterval(interval);
  }, [isLive, alerts.length]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-destructive";
      case "high": return "text-warning";
      case "medium": return "text-warning opacity-75";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "secondary";
      case "medium": return "outline";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "border-destructive text-destructive";
      case "acknowledged": return "border-warning text-warning";
      case "investigating": return "border-primary text-primary";
      case "resolved": return "border-success text-success";
      default: return "border-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return Circle;
      case "acknowledged": return Clock;
      case "investigating": return Activity;
      case "resolved": return CheckCircle;
      default: return XCircle;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const updateAlertStatus = (alertId: string, newStatus: Alert["status"]) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: newStatus } : alert
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alert Log</h1>
          <p className="text-muted-foreground">Real-time monitoring of suspicious activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isLive ? "destructive" : "default"}
            onClick={() => setIsLive(!isLive)}
            size="sm"
          >
            {isLive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause Feed
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume Feed
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-destructive" />
              <span className="text-sm text-muted-foreground">New Alerts</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {filteredAlerts.filter(a => a.status === "new").length}
            </p>
          </CardContent>
        </Card>
        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Critical</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {filteredAlerts.filter(a => a.severity === "critical").length}
            </p>
          </CardContent>
        </Card>
        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Processing</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {filteredAlerts.filter(a => a.status === "investigating").length}
            </p>
          </CardContent>
        </Card>
        <Card className="cyber-border">
          <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <RotateCcw className={`h-4 w-4 ${isLive ? "text-success animate-spin" : "text-muted"}`} />
            <span className="text-sm text-muted-foreground">Feed Status</span>
          </div>
            <p className="text-sm font-medium text-foreground">{isLive ? "LIVE" : "PAUSED"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="cyber-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Filter className="h-5 w-5 text-primary" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4"
              />
            </div>
            <div className="flex gap-2">
              {["all", "critical", "high", "medium", "low"].map((severity) => (
                <Button
                  key={severity}
                  variant={severityFilter === severity ? "default" : "outline"}
                  onClick={() => setSeverityFilter(severity)}
                  size="sm"
                  className="capitalize"
                >
                  {severity}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Feed */}
      <Card className="cyber-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Live Alert Feed
            </div>
            <Badge variant="outline" className="text-xs">
              {filteredAlerts.length} alerts
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-2 p-6">
              {filteredAlerts.map((alert) => {
                let borderClass = "border rounded-lg p-4 transition-all hover:bg-muted/30";
                if (alert.severity === "critical") borderClass += " border-high-risk";
                else if (alert.severity === "high") borderClass += " border-elevated";
                else if (alert.status === "new") borderClass += " border-flagged-user bg-destructive/5";
                else borderClass += " border-border";

                return (
                  <div
                    key={alert.id}
                    className={borderClass}
                  >
                  {/* Alert Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityBadge(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{alert.platform}</Badge>
                      <Badge variant="outline" className={`${getStatusColor(alert.status)} flex items-center gap-1`}>
                        {React.createElement(getStatusIcon(alert.status), { className: "h-3 w-3" })}
                        {alert.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {alert.timestamp}
                    </div>
                  </div>

                  {/* Alert Content */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{alert.type}</span>
                      <span className="text-xs text-muted-foreground">• Confidence: {alert.confidence}%</span>
                    </div>
                    <p className="text-foreground">{alert.message}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {alert.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {alert.location}
                      </span>
                    </div>
                  </div>

                  {/* Alert Actions */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.status === "new" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateAlertStatus(alert.id, "acknowledged")}
                        >
                          Acknowledge
                        </Button>
                      )}
                      {(alert.status === "new" || alert.status === "acknowledged") && (
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => updateAlertStatus(alert.id, "investigating")}
                        >
                          Investigate
                        </Button>
                      )}
                      {alert.status === "investigating" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateAlertStatus(alert.id, "resolved")}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}