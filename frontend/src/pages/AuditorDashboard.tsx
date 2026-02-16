import { useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  FileSearch,
  Leaf,
  MapPin,
  Hash,
  Filter,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockBatches, dashboardStats, herbTypes, HerbBatch } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

export default function AuditorDashboard() {
  const { user } = useAuth();
  const [herbFilter, setHerbFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<HerbBatch | null>(null);
  const stats = dashboardStats.auditor;

  const filteredBatches = mockBatches.filter((batch) => {
    if (herbFilter !== 'all' && batch.herbType !== herbFilter) return false;
    if (statusFilter === 'non-compliant' && batch.complianceStatus !== 'blocked') return false;
    if (statusFilter === 'compliant' && batch.complianceStatus === 'blocked') return false;
    return true;
  });

  const getComplianceBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="badge-approved">Compliant</Badge>;
      case 'blocked':
        return <Badge className="badge-blocked">Non-Compliant</Badge>;
      default:
        return <Badge className="badge-pending">Under Review</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, <span className="text-gradient-primary">{user?.name}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            This is governance without paperwork.
          </p>
        </div>
        <Badge variant="outline" className="w-fit px-4 py-2 border-accent/30 text-accent">
          <Eye className="w-4 h-4 mr-2" />
          Read-Only Access
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tracked', value: stats.totalTracked, icon: FileSearch, color: 'text-accent' },
          { label: 'Compliant', value: stats.compliant, icon: CheckCircle2, color: 'text-success' },
          { label: 'Non-Compliant', value: stats.nonCompliant, icon: AlertTriangle, color: 'text-destructive' },
          { label: 'Regions', value: stats.regionsMonitored, icon: Globe, color: 'text-secondary' },
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

      {/* Compliance Overview Map Placeholder */}
      <Card className="card-elevated">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Harvest Location Map
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-64 bg-muted/30 relative overflow-hidden">
            {/* Map visualization placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-16 h-16 mx-auto text-accent/30 mb-4" />
                <p className="text-muted-foreground">Interactive Geo-Map</p>
                <p className="text-xs text-muted-foreground mt-1">Showing harvest locations across regions</p>
              </div>
            </div>
            {/* Mock location markers */}
            {mockBatches.map((batch, index) => (
              <div
                key={batch.id}
                className={`absolute w-4 h-4 rounded-full animate-pulse-glow cursor-pointer ${
                  batch.complianceStatus === 'approved' ? 'bg-success' :
                  batch.complianceStatus === 'blocked' ? 'bg-destructive' : 'bg-warning'
                }`}
                style={{
                  left: `${20 + (index * 15) % 60}%`,
                  top: `${25 + (index * 12) % 50}%`,
                }}
                title={`${batch.herbName} - ${batch.location.region}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filters:</span>
        </div>
        <Select value={herbFilter} onValueChange={setHerbFilter}>
          <SelectTrigger className="w-48 bg-muted/50">
            <SelectValue placeholder="Herb Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Herbs</SelectItem>
            {herbTypes.map((herb) => (
              <SelectItem key={herb} value={herb}>{herb}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-muted/50">
            <SelectValue placeholder="Compliance Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="compliant">Compliant Only</SelectItem>
            <SelectItem value="non-compliant">Non-Compliant Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Full Batch History Table */}
      <Card className="card-elevated">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Complete Batch History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Batch ID</TableHead>
                <TableHead className="text-muted-foreground">Herb</TableHead>
                <TableHead className="text-muted-foreground">Farmer</TableHead>
                <TableHead className="text-muted-foreground">Region</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">AI Score</TableHead>
                <TableHead className="text-muted-foreground">Eco Valid</TableHead>
                <TableHead className="text-muted-foreground">Compliance</TableHead>
                <TableHead className="text-muted-foreground">Blockchain Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatches.map((batch) => (
                <TableRow 
                  key={batch.id} 
                  className="border-border hover:bg-muted/30 cursor-pointer"
                  onClick={() => setSelectedBatch(batch)}
                >
                  <TableCell className="font-mono text-accent">{batch.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-accent/60" />
                      {batch.herbType}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{batch.farmerName}</TableCell>
                  <TableCell className="text-muted-foreground">{batch.location.region}</TableCell>
                  <TableCell className="text-muted-foreground">{batch.harvestDate}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${
                      batch.aiScore >= 80 ? 'text-success' :
                      batch.aiScore >= 60 ? 'text-warning' : 'text-destructive'
                    }`}>
                      {batch.aiScore}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {batch.ecoValidity ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    )}
                  </TableCell>
                  <TableCell>{getComplianceBadge(batch.complianceStatus)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Hash className="w-3 h-3 text-muted-foreground" />
                      <span className="font-mono text-xs text-muted-foreground truncate max-w-[120px]">
                        {batch.blockchainHash}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Selected Batch Detail Panel */}
      {selectedBatch && (
        <Card className="card-botanical border-accent/20">
          <CardHeader className="border-b border-border flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-accent" />
              Batch Details: {selectedBatch.id}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedBatch(null)}
              className="text-muted-foreground"
            >
              Close
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Basic Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Basic Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Herb Name</span>
                    <span className="font-medium">{selectedBatch.herbName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Farmer</span>
                    <span className="font-medium">{selectedBatch.farmerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium">{selectedBatch.quantity} {selectedBatch.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harvest Date</span>
                    <span className="font-medium">{selectedBatch.harvestDate}</span>
                  </div>
                </div>
              </div>

              {/* Verification */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Verification Status
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">AI Score</span>
                    <span className={`font-bold ${
                      selectedBatch.aiScore >= 80 ? 'text-success' : 
                      selectedBatch.aiScore >= 60 ? 'text-warning' : 'text-destructive'
                    }`}>{selectedBatch.aiScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Potency</span>
                    <span className="font-bold text-accent">{selectedBatch.potency}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Eco Validity</span>
                    {selectedBatch.ecoValidity ? (
                      <span className="text-success flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Valid
                      </span>
                    ) : (
                      <span className="text-destructive flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Invalid
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Blockchain */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Blockchain Record
                </h4>
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                  <p className="font-mono text-xs text-accent break-all">
                    {selectedBatch.blockchainHash}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">GPS Coordinates</p>
                  <p className="font-mono text-xs">
                    {selectedBatch.location.lat}, {selectedBatch.location.lng}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
