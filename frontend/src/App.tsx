import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import FarmerDashboard from "./pages/FarmerDashboard";
import ManufacturerDashboard from "./pages/ManufacturerDashboard";
import AuditorDashboard from "./pages/AuditorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />

            {/* Farmer routes */}
            <Route
              path="/farmer"
              element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<FarmerDashboard />} />
              <Route path="submit" element={<FarmerDashboard />} />
              <Route path="batches" element={<FarmerDashboard />} />
              <Route path="settings" element={<FarmerDashboard />} />
            </Route>

            {/* Manufacturer routes */}
            <Route
              path="/manufacturer"
              element={
                <ProtectedRoute allowedRoles={['manufacturer']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ManufacturerDashboard />} />
              <Route path="batches" element={<ManufacturerDashboard />} />
              <Route path="reports" element={<ManufacturerDashboard />} />
              <Route path="settings" element={<ManufacturerDashboard />} />
            </Route>

            {/* Auditor routes */}
            <Route
              path="/auditor"
              element={
                <ProtectedRoute allowedRoles={['auditor']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AuditorDashboard />} />
              <Route path="history" element={<AuditorDashboard />} />
              <Route path="map" element={<AuditorDashboard />} />
              <Route path="reports" element={<AuditorDashboard />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
