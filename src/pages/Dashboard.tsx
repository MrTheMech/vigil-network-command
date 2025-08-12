import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Activity, 
  MapPin, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  Shield,
  Zap
} from "lucide-react";
import axios from "axios"; // or fetch()
import { useEffect, useState } from "react";


const highRiskLocations = [
  { city: "Mumbai", alerts: 89, risk: "Critical" },
  { city: "Delhi", alerts: 76, risk: "High" },
  { city: "Bengaluru", alerts: 54, risk: "High" },
  { city: "Kolkata", alerts: 42, risk: "Medium" },
  { city: "Chennai", alerts: 38, risk: "Medium" }
];



export default function Dashboard() {
  const [stats, setStats] = useState([
    {
      title: "Flagged Users",
      value: "Loading...",
      change: "+12%",
      icon: Users,
      trend: "up",
      color: "text-warning"
    },
    {
      title: "Active Scans",
      value: "Loading...",
      change: "Live",
      icon: Activity,
      trend: "stable",
      color: "text-success"
    },
    {
      title: "High-Risk Alerts",
      value: "Loading...",
      change: "+8 today",
      icon: AlertTriangle,
      trend: "up",
      color: "text-destructive"
    },
    {
      title: "Threat Level",
      value: "Loading...",
      change: "Monitoring",
      icon: Shield,
      trend: "stable",
      color: "text-warning"
    }
  ]);

  const [recentAlerts, setAlerts] = useState([
    {
      id: 1,
      platform: "Loading...",
      message: "Loading...",
      confidence: 91,
      location: "Mumbai",
      time: "Loading..."
    },
    {
      id: 2,
      platform: "Loading...",
      message: "Loading...",
      confidence: 87,
      location: "Delhi",
      time: "Loading..."
    },
    {
      id: 3,
      platform: "Loading...",
      message: "Loading...",
      confidence: 94,
      location: "Chennai",
      time: "Loading..."
    },
    {
      id: 4,
      platform: "Loading...",
      message: "Loading...",
      confidence: 14,
      location: "Chennai",
      time: "Loading..."
    }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [countRes, recentRes, riskRes, latestRes] = await Promise.all([
          axios.get("http://127.0.0.1:9300/api/count-threat-messages"),
          axios.get("http://127.0.0.1:9300/api/recent-threat-messages"),
          axios.get("http://127.0.0.1:9300/api/high-risk-allert"),
          axios.get("http://127.0.0.1:9300/api/get-rescent-messages")
        ]);

        const count = countRes.data.count;
        const recent = recentRes.data.count;
        const seviearity = recentRes.data.seviarity;
        const riskCount = riskRes.data.count
        const latestMessages = latestRes.data.messages


        setStats((prev) => {
          const updated = [...prev];
          updated[0].value = count.toLocaleString();  // "Flagged Users"
          updated[1].value = recent.toString();       // "Active Scans"
          updated[2].value = riskCount; 
          updated[3].value = seviearity;
          return updated;
        });

        setAlerts((prev) => {
          const updated = [...prev];
          const mergedData = updated.map((item, index) => {
            const dbItem = latestMessages[index];
            if (!dbItem) return item;
          
            return {
              ...item,
              platform: dbItem.channel_username,
              message: dbItem.text,
              time: new Date(dbItem.created_at).toLocaleString() // optional formatting
            };
          });
          console.log(mergedData)
          return mergedData;
        })
        
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Operations Dashboard</h1>
          <p className="text-muted-foreground">Real-time drug trafficking intelligence monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-success text-success">
            <Zap className="h-3 w-3 mr-1" />
            System Online
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          let borderClass = "cyber-border";
          if (stat.title === "Flagged Users") borderClass = "border-flagged-user";
          else if (stat.title === "Active Scans") borderClass = "border-active-scan";
          else if (stat.title === "High-Risk Alerts") borderClass = "border-high-risk";
          else if (stat.title === "Threat Level") borderClass = "border-elevated";

          return (
            <Card key={stat.title} className={borderClass}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change} from last hour
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High-Risk Locations */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              High-Risk Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {highRiskLocations.map((location, index) => (
              <div key={location.city} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground w-6">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{location.city}</p>
                    <p className="text-sm text-muted-foreground">{location.alerts} alerts</p>
                  </div>
                </div>
                <Badge 
                  variant={location.risk === "Critical" ? "destructive" : 
                          location.risk === "High" ? "secondary" : "outline"}
                  className={
                    location.risk === "Critical" ? "risk-glow" :
                    location.risk === "High" ? "warning-glow" : ""
                  }
                >
                  {location.risk}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.map((alert) => {
              let borderClass = "border border-border rounded-lg p-3 space-y-2";
              if (alert.confidence >= 90) borderClass = "border-high-risk rounded-lg p-3 space-y-2";
              else if (alert.confidence >= 85) borderClass = "border-elevated rounded-lg p-3 space-y-2";
              else borderClass = "border-flagged-user rounded-lg p-3 space-y-2";

              return (
                <div key={alert.id} className={borderClass}>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {alert.platform}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Progress value={alert.confidence} className="w-16 h-2" />
                      <span className="text-xs text-muted-foreground">{alert.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {alert.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* System Performance */}
      {/*<Card className="cyber-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Scan Accuracy</span>
                <span className="text-sm font-medium text-foreground">94.2%</span>
              </div>
              <Progress value={94.2} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">API Response</span>
                <span className="text-sm font-medium text-foreground">98.7%</span>
              </div>
              <Progress value={98.7} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Data Processing</span>
                <span className="text-sm font-medium text-foreground">89.3%</span>
              </div>
              <Progress value={89.3} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>*/}
    </div>
  );
}