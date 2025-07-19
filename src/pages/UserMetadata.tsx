import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  AlertTriangle, 
  Users,
  MessageCircle,
  Shield,
  Activity,
  Calendar,
  Eye,
  Smartphone,
  AtSign
} from "lucide-react";

const userProfiles = [
  {
    id: 1,
    username: "@drugdealer_mh",
    platform: "Telegram",
    realName: "Unknown",
    phone: "+91-98765-43210",
    email: "encrypted@telegram",
    ipAddress: "103.21.58.XXX",
    location: "Mumbai, Maharashtra",
    joinDate: "2023-08-15",
    lastActive: "2 hours ago",
    riskScore: 94,
    flaggedMessages: 47,
    connections: 234,
    verificationStatus: "unverified",
    suspiciousActivity: [
      "Multiple drug-related keywords",
      "Encrypted communication patterns",
      "High volume messaging",
      "Connection to known dealers"
    ]
  },
  {
    id: 2,
    username: "@party_supply_delhi",
    platform: "Instagram",
    realName: "Rahul K.",
    phone: "+91-87654-32109",
    email: "party.supply.del@gmail.com",
    ipAddress: "106.51.73.XXX",
    location: "Delhi, NCR",
    joinDate: "2023-06-20",
    lastActive: "30 minutes ago",
    riskScore: 87,
    flaggedMessages: 31,
    connections: 567,
    verificationStatus: "partially_verified",
    suspiciousActivity: [
      "Code word usage",
      "Payment app promotions",
      "Location spoofing detected"
    ]
  },
  {
    id: 3,
    username: "+91-XXXX-XXX-789",
    platform: "WhatsApp",
    realName: "Unknown",
    phone: "+91-96543-21098",
    email: "Not available",
    ipAddress: "157.43.28.XXX",
    location: "Bengaluru, Karnataka",
    joinDate: "2023-09-10",
    lastActive: "1 hour ago",
    riskScore: 91,
    flaggedMessages: 23,
    connections: 89,
    verificationStatus: "unverified",
    suspiciousActivity: [
      "Anonymous messaging",
      "Frequent group creation",
      "Cross-platform coordination"
    ]
  }
];

const connectionNetwork = {
  "@drugdealer_mh": [
    { name: "@supplier_central", type: "dealer", risk: "high" },
    { name: "@crypto_payments", type: "financial", risk: "medium" },
    { name: "DrugChat Group", type: "group", risk: "high", members: 156 },
    { name: "@delivery_network", type: "logistics", risk: "high" }
  ],
  "@party_supply_delhi": [
    { name: "@rave_organizer", type: "customer", risk: "medium" },
    { name: "Party Supplies Hub", type: "group", risk: "high", members: 89 },
    { name: "@payment_gateway", type: "financial", risk: "medium" }
  ]
};

export default function UserMetadata() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(userProfiles[0]);

  const filteredUsers = userProfiles.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.realName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (score: number) => {
    if (score >= 90) return "text-destructive risk-glow";
    if (score >= 70) return "text-warning warning-glow";
    return "text-success";
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified": return "text-success";
      case "partially_verified": return "text-warning";
      case "unverified": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Metadata</h1>
        <p className="text-muted-foreground">Identified user profiles and connection analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User List */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5 text-primary" />
              Flagged Users
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedUser.id === user.id 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.platform}</p>
                  </div>
                  <Badge 
                    variant="outline"
                    className={getRiskColor(user.riskScore)}
                  >
                    {user.riskScore}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {user.location}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* User Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  User Profile
                </div>
                <Badge 
                  variant="outline"
                  className={getRiskColor(selectedUser.riskScore)}
                >
                  Risk Score: {selectedUser.riskScore}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Username</p>
                      <p className="font-medium text-foreground">{selectedUser.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Real Name</p>
                      <p className="font-medium text-foreground">{selectedUser.realName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mobile Number</p>
                      <p className="font-medium text-foreground">{selectedUser.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AtSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email ID</p>
                      <p className="font-medium text-foreground">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">IP Address</p>
                      <p className="font-medium text-foreground">{selectedUser.ipAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Geolocation</p>
                      <p className="font-medium text-foreground">{selectedUser.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Join Date</p>
                      <p className="font-medium text-foreground">{selectedUser.joinDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Active</p>
                      <p className="font-medium text-foreground">{selectedUser.lastActive}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="space-y-4">
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Activity className="h-5 w-5 text-primary" />
                    Activity Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{selectedUser.flaggedMessages}</p>
                      <p className="text-sm text-muted-foreground">Flagged Messages</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{selectedUser.connections}</p>
                      <p className="text-sm text-muted-foreground">Connections</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${getVerificationColor(selectedUser.verificationStatus)}`}>
                        {selectedUser.verificationStatus.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">Verification</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Suspicious Activity Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedUser.suspiciousActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span className="text-foreground">{activity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="connections" className="space-y-4">
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Users className="h-5 w-5 text-primary" />
                    Connection Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {connectionNetwork[selectedUser.username as keyof typeof connectionNetwork] ? (
                    <div className="space-y-3">
                      {connectionNetwork[selectedUser.username as keyof typeof connectionNetwork].map((connection, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">{connection.name}</p>
                              <p className="text-sm text-muted-foreground capitalize">{connection.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {connection.members && (
                              <Badge variant="outline" className="text-xs">
                                {connection.members} members
                              </Badge>
                            )}
                            <Badge 
                              variant="outline"
                              className={
                                connection.risk === "high" ? "text-destructive" :
                                connection.risk === "medium" ? "text-warning" : "text-success"
                              }
                            >
                              {connection.risk.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No connection data available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Eye className="h-5 w-5 text-primary" />
                    Investigation Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-12">
                      <User className="h-4 w-4 mr-2" />
                      View Full Profile
                    </Button>
                    <Button variant="outline" className="h-12">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message History
                    </Button>
                    <Button variant="outline" className="h-12">
                      <MapPin className="h-4 w-4 mr-2" />
                      Location Tracking
                    </Button>
                    <Button variant="destructive" className="h-12">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Flag for Investigation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}