import { useState } from 'react';
import { 
  Package, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp,
  Leaf,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Beaker,
  LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockBatches, dashboardStats, HerbBatch } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ManufacturerDashboard() {
  const { user } = useAuth();
  const [selectedBatch, setSelectedBatch] = useState<HerbBatch | null>(null);
  const stats = dashboardStats.manufacturer;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="badge-approved">Approved</Badge>;
      case 'blocked':
        return <Badge className="badge-blocked">Blocked</Badge>;
      case 'verified':
        return <Badge className="bg-accent/20 text-accent border border-accent/30">Verified</Badge>;
      default:
        return <Badge className="badge-pending">Pending</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, <span className="text-gradient-gold">{user?.name}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            This is where trust matters.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Incoming Batches', value: stats.incomingBatches, icon: Package, color: 'text-accent' },
          { label: 'Pending Decision', value: stats.pendingDecision, icon: Clock, color: 'text-warning' },
          { label: 'Accepted', value: stats.accepted, icon: CheckCircle2, color: 'text-success' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-destructive' },
        ].map((stat) => (
          <Card key={stat.label} className="card-botanical transition-glow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Batch Table */}
      <Card className="card-elevated">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-accent" />
            Incoming Batches
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Batch ID</TableHead>
                <TableHead className="text-muted-foreground">Herb</TableHead>
                <TableHead className="text-muted-foreground">Farmer</TableHead>
                <TableHead className="text-muted-foreground">AI Score</TableHead>
                <TableHead className="text-muted-foreground">Potency</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBatches.map((batch) => (
                <TableRow 
                  key={batch.id} 
                  className="border-border cursor-pointer hover:bg-muted/30"
                  onClick={() => setSelectedBatch(batch)}
                >
                  <TableCell className="font-mono text-accent">{batch.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-accent/60" />
                      {batch.herbName}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{batch.farmerName}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${getScoreColor(batch.aiScore)}`}>
                      {batch.aiScore}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getProgressColor(batch.potency)} transition-all`}
                          style={{ width: `${batch.potency}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{batch.potency}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(batch.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-accent hover:text-accent">
                      View <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Batch Detail Dialog */}
      <Dialog open={!!selectedBatch} onOpenChange={() => setSelectedBatch(null)}>
        <DialogContent className="max-w-3xl bg-card border-border">
          {selectedBatch && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Leaf className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-xl">{selectedBatch.herbName}</span>
                    <span className="ml-3 font-mono text-sm text-muted-foreground">
                      {selectedBatch.id}
                    </span>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                {/* Left - Scores */}
                <div className="space-y-4">
                  {/* AI Score */}
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Beaker className="w-4 h-4" />
                        AI Authenticity Score
                      </span>
                      <span className={`text-2xl font-bold ${getScoreColor(selectedBatch.aiScore)}`}>
                        {selectedBatch.aiScore}%
                      </span>
                    </div>
                    <Progress 
                      value={selectedBatch.aiScore} 
                      className="h-3"
                    />
                  </div>

                  {/* Eco Validity */}
                  <div className="p-4 rounded-lg bg-muted/30 border border-border flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Ecological Validity
                    </span>
                    {selectedBatch.ecoValidity ? (
                      <span className="flex items-center gap-2 text-success">
                        <CheckCircle2 className="w-5 h-5" />
                        Valid
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-destructive">
                        <XCircle className="w-5 h-5" />
                        Invalid
                      </span>
                    )}
                  </div>

                  {/* Compliance Badge */}
                  <div className={`p-6 rounded-lg text-center ${
                    selectedBatch.complianceStatus === 'approved' 
                      ? 'bg-success/10 border-2 border-success/30' 
                      : selectedBatch.complianceStatus === 'blocked'
                      ? 'bg-destructive/10 border-2 border-destructive/30'
                      : 'bg-warning/10 border-2 border-warning/30'
                  }`}>
                    <div className={`text-4xl font-bold mb-2 ${
                      selectedBatch.complianceStatus === 'approved' ? 'text-success' :
                      selectedBatch.complianceStatus === 'blocked' ? 'text-destructive' :
                      'text-warning'
                    }`}>
                      {selectedBatch.complianceStatus === 'approved' ? (
                        <CheckCircle2 className="w-12 h-12 mx-auto" />
                      ) : selectedBatch.complianceStatus === 'blocked' ? (
                        <XCircle className="w-12 h-12 mx-auto" />
                      ) : (
                        <Clock className="w-12 h-12 mx-auto" />
                      )}
                    </div>
                    <p className="text-lg font-semibold capitalize">
                      {selectedBatch.complianceStatus}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Compliance Status
                    </p>
                  </div>
                </div>

                {/* Right - Chart & Details */}
                <div className="space-y-4">
                  {/* Potency Timeline */}
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <LineChart className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium">Potency Timeline</span>
                      <span className="ml-auto text-lg font-bold text-accent">
                        {selectedBatch.potency}%
                      </span>
                    </div>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={selectedBatch.potencyHistory}>
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                            tickFormatter={(v) => v.slice(5)}
                          />
                          <YAxis 
                            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                            domain={[0, 100]}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              background: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="hsl(var(--accent))" 
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--accent))' }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Batch Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-muted-foreground">Farmer</p>
                      <p className="font-medium">{selectedBatch.farmerName}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-muted-foreground">Region</p>
                      <p className="font-medium">{selectedBatch.location.region}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="font-medium">{selectedBatch.quantity} {selectedBatch.unit}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-muted-foreground">Harvest Date</p>
                      <p className="font-medium">{selectedBatch.harvestDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedBatch.complianceStatus !== 'blocked' && (
                <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
                    onClick={() => setSelectedBatch(null)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Batch
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-primary glow-green"
                    onClick={() => setSelectedBatch(null)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Accept Batch
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
