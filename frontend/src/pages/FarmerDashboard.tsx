import { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  MapPin, 
  Leaf, 
  CheckCircle2, 
  ArrowRight,
  Package,
  TrendingUp,
  Clock,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { herbTypes, dashboardStats } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const steps = [
  { id: 1, title: 'Upload Image', description: 'Capture or upload herb photo' },
  { id: 2, title: 'Location', description: 'Confirm GPS coordinates' },
  { id: 3, title: 'Details', description: 'Select herb type and quantity' },
  { id: 4, title: 'Submit', description: 'Review and submit batch' },
];

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedHerb, setSelectedHerb] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = dashboardStats.farmer;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setCurrentStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6),
          });
          setCurrentStep(3);
        },
        () => {
          // Fallback mock location
          setLocation({ lat: '23.2599', lng: '77.4126' });
          setCurrentStep(3);
        }
      );
    } else {
      setLocation({ lat: '23.2599', lng: '77.4126' });
      setCurrentStep(3);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setImagePreview(null);
    setSelectedHerb('');
    setQuantity('');
    setLocation({ lat: '', lng: '' });
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, <span className="text-gradient-primary">{user?.name}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            This is where data enters the system.
          </p>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Batches', value: stats.totalBatches, icon: Package, color: 'text-accent' },
          { label: 'Pending', value: stats.pendingVerification, icon: Clock, color: 'text-warning' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-success' },
          { label: 'Rejected', value: stats.rejected, icon: AlertCircle, color: 'text-destructive' },
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

      {/* Submit Harvest Section */}
      <Card className="card-elevated">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-accent" />
            Submit New Harvest Batch
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep >= step.id
                        ? 'bg-accent text-accent-foreground glow-green-sm'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isSubmitted && step.id === 4 ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <p className="text-xs mt-2 text-center hidden md:block text-muted-foreground">
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 lg:w-24 h-0.5 mx-2 transition-colors ${
                      currentStep > step.id ? 'bg-accent' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {!isSubmitted ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Image Upload */}
              <div className="space-y-4">
                <Label>Herb Image</Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative aspect-video rounded-lg border-2 border-dashed transition-all cursor-pointer flex items-center justify-center ${
                    imagePreview
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent/50 hover:bg-muted/50'
                  }`}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Herb preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                  </Button>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="space-y-4">
                {/* Location */}
                <div className="space-y-2">
                  <Label>GPS Location</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Latitude"
                      value={location.lat}
                      onChange={(e) => setLocation({ ...location, lat: e.target.value })}
                      className="bg-muted/50"
                    />
                    <Input
                      placeholder="Longitude"
                      value={location.lng}
                      onChange={(e) => setLocation({ ...location, lng: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGetLocation}
                    className="w-full"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Auto-detect Location
                  </Button>
                </div>

                {/* Herb Type */}
                <div className="space-y-2">
                  <Label>Herb Type</Label>
                  <Select value={selectedHerb} onValueChange={(v) => { setSelectedHerb(v); setCurrentStep(Math.max(currentStep, 3)); }}>
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder="Select herb type" />
                    </SelectTrigger>
                    <SelectContent>
                      {herbTypes.map((herb) => (
                        <SelectItem key={herb} value={herb}>
                          {herb}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label>Quantity (kg)</Label>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => { setQuantity(e.target.value); if (e.target.value) setCurrentStep(4); }}
                    className="bg-muted/50"
                  />
                </div>

                {/* Submit */}
                <Button
                  onClick={handleSubmit}
                  disabled={!imagePreview || !selectedHerb || !quantity || isSubmitting}
                  className="w-full bg-gradient-primary hover:opacity-90 mt-4 glow-green"
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Submit Batch
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="text-center py-12 animate-scale-in">
              <div className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-4 glow-green">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Batch Submitted Successfully!
              </h3>
              <p className="text-muted-foreground mb-6">
                Your harvest data has been submitted for verification.
                <br />
                Batch ID: <span className="text-accent font-mono">BTH-{Date.now().toString().slice(-6)}</span>
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={resetForm}>
                  Submit Another
                </Button>
                <Button className="bg-gradient-primary">
                  View My Batches
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="card-botanical">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-accent" />
            Recent Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 'BTH-001', herb: 'Ashwagandha', date: '2 hours ago', status: 'Verified' },
              { id: 'BTH-002', herb: 'Tulsi', date: '1 day ago', status: 'Approved' },
              { id: 'BTH-003', herb: 'Brahmi', date: '3 days ago', status: 'Pending' },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.herb}</p>
                    <p className="text-xs text-muted-foreground">{item.id} • {item.date}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.status === 'Approved' ? 'badge-approved' :
                  item.status === 'Verified' ? 'bg-accent/20 text-accent border border-accent/30' :
                  'badge-pending'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
