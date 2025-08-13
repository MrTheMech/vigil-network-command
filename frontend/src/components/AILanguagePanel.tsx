import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiGet } from "@/lib/api";
import { Brain, AlertTriangle, TrendingUp, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface CodewordMapping {
  slang: string;
  realTerm: string;
  confidence: number;
  detections: number;
  category: string;
}

const defaultCodewords: CodewordMapping[] = [
  { slang: "candy", realTerm: "MDMA/Ecstasy", confidence: 91, detections: 45, category: "Stimulant" },
  { slang: "snow", realTerm: "Cocaine", confidence: 95, detections: 67, category: "Stimulant" },
  { slang: "grass", realTerm: "Cannabis", confidence: 88, detections: 23, category: "Cannabis" },
  { slang: "ice", realTerm: "Crystal Meth", confidence: 93, detections: 34, category: "Stimulant" },
  { slang: "moon rocks", realTerm: "High-grade Cannabis", confidence: 85, detections: 18, category: "Cannabis" },
  { slang: "fishscale", realTerm: "Pure Cocaine", confidence: 89, detections: 29, category: "Stimulant" },
  { slang: "molly", realTerm: "MDMA", confidence: 94, detections: 52, category: "Stimulant" },
  { slang: "white girl", realTerm: "Cocaine", confidence: 87, detections: 41, category: "Stimulant" },
];

export function AILanguagePanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [newSlang, setNewSlang] = useState("");
  const [newTerm, setNewTerm] = useState("");
  const [codewords, setCodewords] = useState<CodewordMapping[]>(defaultCodewords);

  useEffect(() => {
    (async () => {
      const data = await apiGet<CodewordMapping[]>("/api/codewords", defaultCodewords);
      setCodewords(data);
    })();
  }, []);

  const filteredCodewords = codewords.filter(
    (item) =>
      item.slang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.realTerm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const submitNewSlang = () => {
    // API call to submit new slang for training would go here
    console.log("Submitting new slang:", { slang: newSlang, term: newTerm });
    setIsSubmitDialogOpen(false);
    setNewSlang("");
    setNewTerm("");
  };

  return (
    <Card className="cyber-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Language Monitoring
          </CardTitle>
          <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="hover-glow">
                <Plus className="w-4 h-4 mr-2" />
                Submit Slang
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit New Slang for AI Training</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="slang">Slang Term</Label>
                  <Input
                    id="slang"
                    placeholder="e.g., 'white tiger'"
                    value={newSlang}
                    onChange={(e) => setNewSlang(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="term">Real Drug Term</Label>
                  <Input
                    id="term"
                    placeholder="e.g., 'Fentanyl'"
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submitNewSlang}>Submit for Training</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search codewords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {codewords.length} terms detected
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredCodewords.map((mapping, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-lg bg-muted/30 border hover-glow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-mono text-lg font-semibold text-primary group-hover:text-accent transition-colors">
                    "{mapping.slang}"
                  </p>
                  <p className="text-sm text-muted-foreground">→ {mapping.realTerm}</p>
                </div>
                <Badge
                  className={`${
                    mapping.confidence >= 90
                      ? "severity-critical"
                      : mapping.confidence >= 80
                      ? "severity-high"
                      : mapping.confidence >= 70
                      ? "severity-medium"
                      : "severity-low"
                  }`}
                >
                  {mapping.confidence}%
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <Badge variant="outline">{mapping.category}</Badge>
                <span className="text-muted-foreground flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {mapping.detections} detections
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}