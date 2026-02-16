export interface HerbBatch {
  id: string;
  herbName: string;
  herbType: string;
  farmerName: string;
  farmerId: string;
  harvestDate: string;
  submissionDate: string;
  location: {
    lat: number;
    lng: number;
    region: string;
  };
  imageUrl: string;
  status: 'pending' | 'verified' | 'approved' | 'blocked';
  aiScore: number;
  ecoValidity: boolean;
  potency: number;
  potencyHistory: { date: string; value: number }[];
  blockchainHash: string;
  complianceStatus: 'approved' | 'pending' | 'blocked';
  quantity: number;
  unit: string;
}

export const herbTypes = [
  'Ashwagandha',
  'Tulsi',
  'Brahmi',
  'Neem',
  'Turmeric',
  'Amla',
  'Shatavari',
  'Guduchi',
  'Triphala',
  'Moringa',
];

export const mockBatches: HerbBatch[] = [
  {
    id: 'BTH-001',
    herbName: 'Ashwagandha Root',
    herbType: 'Ashwagandha',
    farmerName: 'Rajesh Kumar',
    farmerId: 'FRM-001',
    harvestDate: '2025-01-28',
    submissionDate: '2025-01-29',
    location: { lat: 23.2599, lng: 77.4126, region: 'Madhya Pradesh' },
    imageUrl: '/placeholder.svg',
    status: 'approved',
    aiScore: 94,
    ecoValidity: true,
    potency: 87,
    potencyHistory: [
      { date: '2025-01-29', value: 85 },
      { date: '2025-01-30', value: 86 },
      { date: '2025-01-31', value: 87 },
      { date: '2025-02-01', value: 87 },
    ],
    blockchainHash: '0x7f8a3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    complianceStatus: 'approved',
    quantity: 250,
    unit: 'kg',
  },
  {
    id: 'BTH-002',
    herbName: 'Holy Basil Leaves',
    herbType: 'Tulsi',
    farmerName: 'Priya Sharma',
    farmerId: 'FRM-002',
    harvestDate: '2025-01-30',
    submissionDate: '2025-01-31',
    location: { lat: 26.8467, lng: 80.9462, region: 'Uttar Pradesh' },
    imageUrl: '/placeholder.svg',
    status: 'verified',
    aiScore: 89,
    ecoValidity: true,
    potency: 78,
    potencyHistory: [
      { date: '2025-01-31', value: 76 },
      { date: '2025-02-01', value: 78 },
    ],
    blockchainHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    complianceStatus: 'pending',
    quantity: 180,
    unit: 'kg',
  },
  {
    id: 'BTH-003',
    herbName: 'Brahmi Extract',
    herbType: 'Brahmi',
    farmerName: 'Amit Patel',
    farmerId: 'FRM-003',
    harvestDate: '2025-01-25',
    submissionDate: '2025-01-26',
    location: { lat: 22.3072, lng: 73.1812, region: 'Gujarat' },
    imageUrl: '/placeholder.svg',
    status: 'blocked',
    aiScore: 45,
    ecoValidity: false,
    potency: 34,
    potencyHistory: [
      { date: '2025-01-26', value: 38 },
      { date: '2025-01-27', value: 35 },
      { date: '2025-01-28', value: 34 },
    ],
    blockchainHash: '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d',
    complianceStatus: 'blocked',
    quantity: 120,
    unit: 'kg',
  },
  {
    id: 'BTH-004',
    herbName: 'Neem Bark',
    herbType: 'Neem',
    farmerName: 'Sunita Devi',
    farmerId: 'FRM-004',
    harvestDate: '2025-02-01',
    submissionDate: '2025-02-02',
    location: { lat: 25.5941, lng: 85.1376, region: 'Bihar' },
    imageUrl: '/placeholder.svg',
    status: 'pending',
    aiScore: 82,
    ecoValidity: true,
    potency: 71,
    potencyHistory: [
      { date: '2025-02-02', value: 71 },
    ],
    blockchainHash: '0x3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e',
    complianceStatus: 'pending',
    quantity: 95,
    unit: 'kg',
  },
  {
    id: 'BTH-005',
    herbName: 'Turmeric Rhizome',
    herbType: 'Turmeric',
    farmerName: 'Vikram Singh',
    farmerId: 'FRM-005',
    harvestDate: '2025-01-27',
    submissionDate: '2025-01-28',
    location: { lat: 15.3173, lng: 75.7139, region: 'Karnataka' },
    imageUrl: '/placeholder.svg',
    status: 'approved',
    aiScore: 97,
    ecoValidity: true,
    potency: 92,
    potencyHistory: [
      { date: '2025-01-28', value: 88 },
      { date: '2025-01-29', value: 90 },
      { date: '2025-01-30', value: 91 },
      { date: '2025-01-31', value: 92 },
    ],
    blockchainHash: '0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    complianceStatus: 'approved',
    quantity: 320,
    unit: 'kg',
  },
  {
    id: 'BTH-006',
    herbName: 'Amla Fruit',
    herbType: 'Amla',
    farmerName: 'Lakshmi Naidu',
    farmerId: 'FRM-006',
    harvestDate: '2025-02-03',
    submissionDate: '2025-02-04',
    location: { lat: 17.3850, lng: 78.4867, region: 'Telangana' },
    imageUrl: '/placeholder.svg',
    status: 'verified',
    aiScore: 91,
    ecoValidity: true,
    potency: 84,
    potencyHistory: [
      { date: '2025-02-04', value: 84 },
    ],
    blockchainHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
    complianceStatus: 'pending',
    quantity: 200,
    unit: 'kg',
  },
];

export const dashboardStats = {
  farmer: {
    totalBatches: 24,
    pendingVerification: 3,
    approved: 18,
    rejected: 3,
  },
  manufacturer: {
    incomingBatches: 12,
    pendingDecision: 5,
    accepted: 42,
    rejected: 8,
  },
  auditor: {
    totalTracked: 156,
    compliant: 142,
    nonCompliant: 14,
    regionsMonitored: 8,
  },
};
