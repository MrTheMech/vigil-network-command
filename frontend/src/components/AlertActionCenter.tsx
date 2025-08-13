import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, Users, Download, Archive, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Alert {
  id: string;
  platform: string;
  content: string;
  username: string;
  timestamp: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "pending" | "reviewed" | "escalated" | "false_positive";
  assignedAgent?: string;
}

const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    platform: "Telegram",
    content: "Looking for some candy for the weekend party",
    username: "@party_lover23",
    timestamp: "2024-01-15 14:23:45",
    severity: "high",
    status: "pending",
  },
  {
    id: "ALT-002",
    platform: "WhatsApp",
    content: "Got that white snow if you need it",
    username: "+91-9876543210",
    timestamp: "2024-01-15 13:15:22",
    severity: "critical",
    status: "escalated",
    assignedAgent: "Agent Smith",
  },
  {
    id: "ALT-003",
    platform: "Instagram",
    content: "Fresh green available, DM for details",
    username: "@green_supplier",
    timestamp: "2024-01-15 12:45:10",
    severity: "medium",
    status: "reviewed",
  },
];

export function AlertActionCenter() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionNotes, setActionNotes] = useState("");

  const filteredAlerts = alerts.filter(alert => 
    filterStatus === "all" || alert.status === filterStatus
  );

  const updateAlertStatus = (alertId: string, newStatus: Alert["status"], notes?: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: newStatus, assignedAgent: newStatus === "escalated" ? "Current User" : undefined }
        : alert
    ));
    setActionDialogOpen(false);
    setActionNotes("");
  };

  const exportAlert = (alert: Alert) => {
    // PDF export functionality
    console.log("Exporting alert to PDF:", alert);
  };

  const assignToAgent = (alertId: string, agentName: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, assignedAgent: agentName } : alert
    ));
  };

  return (
    <Card className="cyber-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Alert Action Center
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="false_positive">False Positive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg border bg-muted/30 hover-glow cursor-pointer"
              onClick={() => setSelectedAlert(alert)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge
                    className={`severity-${alert.severity}`}
                  >
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{alert.platform}</Badge>
                  <span className="text-sm font-mono text-muted-foreground">{alert.id}</span>
                </div>
                <div className="flex items-center gap-1">
                  {alert.status === "pending" && (
                    <Badge variant="secondary">Pending Review</Badge>
                  )}
                  {alert.status === "reviewed" && (
                    <Badge className="severity-low">Reviewed</Badge>
                  )}
                  {alert.status === "escalated" && (
                    <Badge className="severity-critical">Escalated</Badge>
                  )}
                  {alert.status === "false_positive" && (
                    <Badge variant="outline">False Positive</Badge>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <p className="font-medium">{alert.username}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{alert.content}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                <div className="flex items-center gap-2">
                  {alert.assignedAgent && (
                    <Badge variant="outline" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {alert.assignedAgent}
                    </Badge>
                  )}
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    exportAlert(alert);
                  }}>
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alert Actions - {selectedAlert?.id}</DialogTitle>
            </DialogHeader>
            {selectedAlert && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="font-medium">{selectedAlert.username}</p>
                  <p className="text-sm text-muted-foreground">{selectedAlert.content}</p>
                </div>

                <div>
                  <Label htmlFor="notes">Action Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add your investigation notes..."
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => updateAlertStatus(selectedAlert.id, "false_positive", actionNotes)}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Mark as False Positive
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => updateAlertStatus(selectedAlert.id, "reviewed", actionNotes)}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Reviewed
                  </Button>
                  <Button
                    onClick={() => updateAlertStatus(selectedAlert.id, "escalated", actionNotes)}
                    className="flex items-center gap-2 severity-critical"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Escalate to NCB
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {selectedAlert && !actionDialogOpen && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              onClick={() => setActionDialogOpen(true)}
              className="w-full"
            >
              Take Action on {selectedAlert.id}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}