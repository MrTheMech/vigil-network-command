import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  Shield, 
  Database, 
  Bell, 
  Activity,
  Key,
  Server,
  AlertTriangle,
  CheckCircle,
  Clock,
  Save
} from "lucide-react";

export default function Settings() {
  const [confidenceThreshold, setConfidenceThreshold] = useState([85]);
  const [realTimeAlerts, setRealTimeAlerts] = useState(true);
  const [autoEscalation, setAutoEscalation] = useState(false);
  const [blockchainSync, setBlockchainSync] = useState(true);

  const apiConnections = [
    { name: "Telegram Bot API", status: "connected", lastSync: "2 min ago" },
    { name: "Instagram Graph API", status: "connected", lastSync: "5 min ago" },
    { name: "WhatsApp Business API", status: "error", lastSync: "1 hour ago" },
    { name: "Blockchain Node", status: "syncing", lastSync: "Real-time" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "text-success";
      case "syncing": return "text-warning";
      case "error": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <CheckCircle className="h-4 w-4" />;
      case "syncing": return <Activity className="h-4 w-4 animate-spin" />;
      case "error": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure detection thresholds, API connections, and system preferences</p>
      </div>

      <Tabs defaultValue="detection" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="detection">Detection</TabsTrigger>
          <TabsTrigger value="apis">API Connections</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Detection Settings */}
        <TabsContent value="detection" className="space-y-6">
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="h-5 w-5 text-primary" />
                Detection Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Minimum Confidence Threshold: {confidenceThreshold[0]}%
                  </Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Only flag messages with confidence above this threshold
                  </p>
                  <Slider
                    value={confidenceThreshold}
                    onValueChange={setConfidenceThreshold}
                    max={100}
                    min={50}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Drug Keywords</Label>
                    <div className="space-y-2">
                      <Input placeholder="Add new keyword..." />
                      <div className="flex flex-wrap gap-2">
                        {["candy", "snow", "grass", "charlie", "ice"].map((keyword) => (
                          <Badge key={keyword} variant="outline">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Location Monitoring</Label>
                    <div className="space-y-2">
                      <Input placeholder="Add location..." />
                      <div className="flex flex-wrap gap-2">
                        {["Mumbai", "Delhi", "Bengaluru", "Chennai"].map((location) => (
                          <Badge key={location} variant="outline">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Activity className="h-5 w-5 text-primary" />
                Behavioral Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Pattern Recognition</Label>
                  <p className="text-xs text-muted-foreground">Analyze messaging patterns for suspicious behavior</p>
                </div>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Network Analysis</Label>
                  <p className="text-xs text-muted-foreground">Monitor user connections and group activities</p>
                </div>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Location Tracking</Label>
                  <p className="text-xs text-muted-foreground">Track geographic patterns of activities</p>
                </div>
                <Switch checked={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Connections */}
        <TabsContent value="apis" className="space-y-6">
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Server className="h-5 w-5 text-primary" />
                Platform API Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiConnections.map((api) => (
                <div key={api.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={getStatusColor(api.status)}>
                      {getStatusIcon(api.status)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{api.name}</p>
                      <p className="text-xs text-muted-foreground">Last sync: {api.lastSync}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(api.status)}
                    >
                      {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Key className="h-5 w-5 text-primary" />
                API Keys & Secrets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">Telegram Bot Token</Label>
                  <Input type="password" placeholder="••••••••••••••••" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">Instagram App Secret</Label>
                  <Input type="password" placeholder="••••••••••••••••" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">WhatsApp Business API</Label>
                  <Input type="password" placeholder="••••••••••••••••" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">Blockchain RPC URL</Label>
                  <Input placeholder="https://..." />
                </div>
              </div>
              <Button className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save API Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert Settings */}
        <TabsContent value="alerts" className="space-y-6">
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Bell className="h-5 w-5 text-primary" />
                Alert Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Real-time Alerts</Label>
                    <p className="text-xs text-muted-foreground">Receive immediate notifications for new threats</p>
                  </div>
                  <Switch checked={realTimeAlerts} onCheckedChange={setRealTimeAlerts} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Auto-escalation</Label>
                    <p className="text-xs text-muted-foreground">Automatically escalate critical alerts to NCB</p>
                  </div>
                  <Switch checked={autoEscalation} onCheckedChange={setAutoEscalation} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Send alert summaries via email</p>
                  </div>
                  <Switch checked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">SMS Alerts</Label>
                    <p className="text-xs text-muted-foreground">Critical alerts via SMS</p>
                  </div>
                  <Switch checked={false} />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Label className="text-sm font-medium text-foreground">Notification Recipients</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <Input placeholder="officer1@agency.gov" />
                  <Input placeholder="supervisor@agency.gov" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Database className="h-5 w-5 text-primary" />
                Blockchain & Data Sync
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Blockchain Sync</Label>
                  <p className="text-xs text-muted-foreground">Sync transaction data for crypto payments</p>
                </div>
                <Switch checked={blockchainSync} onCheckedChange={setBlockchainSync} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Data Retention</Label>
                  <p className="text-xs text-muted-foreground">Keep alert data for compliance</p>
                </div>
                <Switch checked={true} />
              </div>

              <div className="pt-4 border-t border-border">
                <Label className="text-sm font-medium text-foreground">Sync Status</Label>
                <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Last Full Sync</span>
                    <span className="text-sm text-muted-foreground">2024-01-15 14:30:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Blockchain Height</span>
                    <span className="text-sm text-muted-foreground">Block #18,945,623</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Processed Transactions</span>
                    <span className="text-sm text-muted-foreground">2,847,392</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <SettingsIcon className="h-5 w-5 text-primary" />
                System Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-12">
                  <Database className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
                <Button variant="outline" className="h-12">
                  <Activity className="h-4 w-4 mr-2" />
                  Restart Services
                </Button>
                <Button variant="outline" className="h-12">
                  <Server className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
                <Button variant="destructive" className="h-12">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Stop
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}