import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Globe, Smartphone, Mail, MapPin, Network, Clock, Shield, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DrillDownPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    id: string;
    username: string;
    platform: string;
    profilePicture?: string;
    usernameHistory: string[];
    messages: Array<{
      content: string;
      timestamp: string;
      platform: string;
      confidence: number;
    }>;
    metadata: {
      ipAddress: string;
      deviceInfo: string;
      lastSeen: string;
      location: string;
    };
    connections: Array<{
      username: string;
      platform: string;
      relationship: string;
    }>;
  } | null;
}

export function DrillDownPanel({ isOpen, onClose, userData }: DrillDownPanelProps) {
  const [activeTab, setActiveTab] = useState("profile");

  if (!isOpen || !userData) return null;

  const exportToPDF = () => {
    // PDF export logic would go here
    console.log("Exporting user data to PDF...");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-6xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="cyber-border">
              <CardHeader className="flex flex-row items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    {userData.profilePicture ? (
                      <img src={userData.profilePicture} alt={userData.username} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{userData.username}</CardTitle>
                    <p className="text-muted-foreground">{userData.platform} • ID: {userData.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={exportToPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0">
                <div className="flex space-x-1 mb-6">
                  {["profile", "messages", "connections", "metadata"].map((tab) => (
                    <Button
                      key={tab}
                      variant={activeTab === tab ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab(tab)}
                      className="capitalize"
                    >
                      {tab}
                    </Button>
                  ))}
                </div>

                <div className="overflow-y-auto max-h-[60vh]">
                  {activeTab === "profile" && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Username History
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {userData.usernameHistory.map((username, index) => (
                            <Badge key={index} variant="secondary">
                              {username}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Globe className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">IP Address</p>
                            <p className="font-mono">{userData.metadata.ipAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <MapPin className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p>{userData.metadata.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Smartphone className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Device</p>
                            <p>{userData.metadata.deviceInfo}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Clock className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Last Seen</p>
                            <p>{userData.metadata.lastSeen}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "messages" && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      {userData.messages.map((message, index) => (
                        <div key={index} className="p-4 rounded-lg bg-muted/30 border">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{message.platform}</Badge>
                            <div className="flex items-center gap-2">
                              <Badge 
                                className={`${message.confidence >= 80 ? 'severity-critical' : 
                                           message.confidence >= 60 ? 'severity-high' : 
                                           message.confidence >= 40 ? 'severity-medium' : 'severity-low'}`}
                              >
                                {message.confidence}% confidence
                              </Badge>
                              <span className="text-sm text-muted-foreground">{message.timestamp}</span>
                            </div>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "connections" && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-center p-8 text-muted-foreground">
                        <Network className="w-12 h-12 mx-auto mb-4" />
                        <p>Connection graph visualization would be implemented here</p>
                        <p className="text-sm mt-2">Showing {userData.connections.length} connected users/groups</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {userData.connections.map((connection, index) => (
                          <div key={index} className="p-3 rounded-lg bg-muted/30 border">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{connection.username}</span>
                              <Badge variant="outline">{connection.platform}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{connection.relationship}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "metadata" && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Security Analysis
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm">Risk Level</span>
                                <Badge className="severity-high">High Risk</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Account Age</span>
                                <span className="text-sm text-muted-foreground">3 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Verification Status</span>
                                <span className="text-sm text-destructive">Unverified</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}