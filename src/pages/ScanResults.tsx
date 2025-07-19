import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  MessageSquare,
  User,
  ExternalLink,
  Camera,
  MessageCircle,
  Send,
  BarChart3,
  Flag
} from "lucide-react";

const scanResults = [
  {
    id: 1,
    platform: "Telegram",
    user: "@drugdealer_mh",
    message: "Got that premium candy, DM for prices 🍭",
    detectedTerm: "candy",
    substance: "MDMA",
    confidence: 94,
    location: "Mumbai, Maharashtra",
    timestamp: "2024-01-15 14:23:45",
    status: "pending",
    riskLevel: "high"
  },
  {
    id: 2,
    platform: "Instagram",
    user: "@party_supply_delhi",
    message: "White snow available for weekend parties ❄️",
    detectedTerm: "snow",
    substance: "Cocaine",
    confidence: 91,
    location: "Delhi, NCR",
    timestamp: "2024-01-15 14:18:12",
    status: "reviewed",
    riskLevel: "critical"
  },
  {
    id: 3,
    platform: "WhatsApp",
    user: "+91-XXXX-XXX-789",
    message: "Charlie delivery tonight, usual spot",
    detectedTerm: "charlie",
    substance: "Cocaine",
    confidence: 87,
    location: "Bengaluru, Karnataka",
    timestamp: "2024-01-15 14:15:33",
    status: "escalated",
    riskLevel: "critical"
  },
  {
    id: 4,
    platform: "Telegram",
    user: "@green_supplier",
    message: "Fresh grass from Himachal, premium quality 🌿",
    detectedTerm: "grass",
    substance: "Cannabis",
    confidence: 89,
    location: "Chandigarh, Punjab",
    timestamp: "2024-01-15 14:12:07",
    status: "pending",
    riskLevel: "medium"
  },
  {
    id: 5,
    platform: "Instagram",
    user: "@weekend_vibes_bom",
    message: "Pills for the rave tonight, tested and pure 💊",
    detectedTerm: "pills",
    substance: "MDMA/Ecstasy",
    confidence: 96,
    location: "Mumbai, Maharashtra",
    timestamp: "2024-01-15 14:08:41",
    status: "pending",
    riskLevel: "high"
  }
];

export default function ScanResults() {
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [confidenceFilter, setConfidenceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "border-warning text-warning";
      case "reviewed": return "border-success text-success";
      case "escalated": return "border-destructive text-destructive";
      default: return "border-muted text-muted-foreground";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical": return "text-destructive risk-glow";
      case "high": return "text-warning warning-glow";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram": return Camera;
      case "whatsapp": return MessageCircle;
      case "telegram": return Send;
      default: return MessageSquare;
    }
  };

  const filteredResults = scanResults.filter(result => {
    const matchesSearch = result.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.detectedTerm.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === "all" || result.platform.toLowerCase() === platformFilter;
    const matchesConfidence = confidenceFilter === "all" || 
                             (confidenceFilter === "high" && result.confidence >= 90) ||
                             (confidenceFilter === "medium" && result.confidence >= 70 && result.confidence < 90) ||
                             (confidenceFilter === "low" && result.confidence < 70);
    
    return matchesSearch && matchesPlatform && matchesConfidence;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Scan Results</h1>
        <p className="text-muted-foreground">Flagged messages and posts from social media platforms</p>
      </div>

      {/* Filters */}
      <Card className="cyber-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Filter className="h-5 w-5 text-primary" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages, users, terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
            <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Confidence</SelectItem>
                <SelectItem value="high">High (90%+)</SelectItem>
                <SelectItem value="medium">Medium (70-89%)</SelectItem>
                <SelectItem value="low">Low (&lt;70%)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="bengaluru">Bengaluru</SelectItem>
                <SelectItem value="chennai">Chennai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Results</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{filteredResults.length}</p>
          </CardContent>
        </Card>
        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-muted-foreground">High Risk</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {filteredResults.filter(r => r.riskLevel === "critical" || r.riskLevel === "high").length}
            </p>
          </CardContent>
        </Card>
        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Avg. Confidence</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {Math.round(filteredResults.reduce((acc, r) => acc + r.confidence, 0) / filteredResults.length)}%
            </p>
          </CardContent>
        </Card>
        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Pending Review</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {filteredResults.filter(r => r.status === "pending").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.map((result) => (
          <Card key={result.id} className="cyber-border">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {React.createElement(getPlatformIcon(result.platform), { className: "h-3 w-3" })}
                      {result.platform}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={getStatusColor(result.status)}
                    >
                      {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={getRiskColor(result.riskLevel)}
                    >
                      {result.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <Progress value={result.confidence} className="w-20 h-2" />
                    <span className="text-sm font-medium text-foreground">{result.confidence}%</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{result.user}</span>
                  </div>
                  <blockquote className="border-l-4 border-primary pl-4 text-foreground bg-muted/30 p-3 rounded-r">
                    {result.message}
                  </blockquote>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Detected: <strong className="text-warning">{result.detectedTerm}</strong> → {result.substance}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {result.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {result.timestamp}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Original
                    </Button>
                    <Button size="sm" variant="outline">
                      User Profile
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline">
                          Mark Reviewed
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Flag className="h-3 w-3 mr-1" />
                          Escalate to NCB
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}