import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Database, Cpu, Wifi, Shield, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SystemStatus {
  uptime: string;
  uptimePercentage: number;
  memoryUsage: number;
  cpuUsage: number;
  dbStatus: "online" | "warning" | "error";
  networkStatus: "online" | "warning" | "error";
  securityStatus: "secure" | "warning" | "breach";
}

export function SystemFooter() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    uptime: "7d 14h 23m",
    uptimePercentage: 99.7,
    memoryUsage: 67,
    cpuUsage: 34,
    dbStatus: "online",
    networkStatus: "online",
    securityStatus: "secure",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setSystemStatus(prev => ({
        ...prev,
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 10)),
        cpuUsage: Math.max(10, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 15)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
      case "secure":
        return "status-online";
      case "warning":
        return "status-warning";
      case "error":
      case "breach":
        return "status-error";
      default:
        return "status-online";
    }
  };

  return (
    <motion.footer
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-3 z-40"
    >
      <div className="flex items-center justify-between max-w-full overflow-x-auto">
        <div className="flex items-center gap-6 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor(systemStatus.networkStatus)}`} />
            <span className="text-sm font-medium">LEA Intel System</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Uptime: {systemStatus.uptime}</span>
            <Badge variant="outline" className="ml-2">
              {systemStatus.uptimePercentage}%
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <Cpu className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">CPU: {systemStatus.cpuUsage}%</span>
            <div className="w-12 h-2 bg-muted rounded-full overflow-hidden ml-1">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${systemStatus.cpuUsage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Memory: {systemStatus.memoryUsage}%</span>
            <div className="w-12 h-2 bg-muted rounded-full overflow-hidden ml-1">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${systemStatus.memoryUsage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus.dbStatus)}`} />
          </div>

          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus.networkStatus)}`} />
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus.securityStatus)}`} />
          </div>

          <Badge variant="outline" className="text-xs">
            v2.1.0
          </Badge>
        </div>
      </div>
    </motion.footer>
  );
}