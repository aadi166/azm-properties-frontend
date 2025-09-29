// Static projects data for offplan market
export const projects = [
  {
    _id: "1",
    id: "1",
    title: "The Opus by Omniyat",
    description: "An architectural masterpiece by Zaha Hadid featuring luxury residences, offices, and retail spaces in the heart of Business Bay.",
    priceRange: {
      min: 2500000,
      max: 15000000,
      currency: "AED"
    },
    location: "Business Bay",
    area: "Dubai",
    country: "UAE",
    status: "under-construction",
    completionDate: "2025-06-30",
    launchDate: "2023-01-15",
    developer: "Omniyat",
    architect: "Zaha Hadid Architects",
    totalUnits: 250,
    availableUnits: 45,
    projectType: "Mixed-Use",
    category: "luxury",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
    ],
    unitTypes: [
      { type: "1 Bedroom", size: "800-1000 sqft", priceFrom: 2500000 },
      { type: "2 Bedroom", size: "1200-1500 sqft", priceFrom: 4200000 },
      { type: "3 Bedroom", size: "1800-2200 sqft", priceFrom: 6800000 },
      { type: "Penthouse", size: "3500-5000 sqft", priceFrom: 15000000 }
    ],
    amenities: ["Infinity Pool", "Spa & Wellness", "Fine Dining", "Concierge", "Valet Parking", "Business Center"],
    keyHighlights: [
      "Designed by Zaha Hadid Architects",
      "Prime Business Bay location",
      "Iconic architectural design",
      "Luxury amenities and services",
      "High rental yield potential"
    ],
    paymentPlan: "20% on booking, 60% during construction, 20% on completion",
    roi: "8-10%",
    handoverDate: "Q2 2025",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-20T00:00:00.000Z"
  },
  {
    _id: "2",
    id: "2",
    title: "Creek Harbour by Emaar",
    description: "A waterfront destination featuring luxury residences with stunning views of Dubai Creek and the city skyline.",
    priceRange: {
      min: 1800000,
      max: 12000000,
      currency: "AED"
    },
    location: "Creek Harbour",
    area: "Dubai",
    country: "UAE",
    status: "pre-launch",
    completionDate: "2026-12-31",
    launchDate: "2024-03-01",
    developer: "Emaar Properties",
    architect: "Foster + Partners",
    totalUnits: 500,
    availableUnits: 500,
    projectType: "Residential",
    category: "premium",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop"
    ],
    unitTypes: [
      { type: "1 Bedroom", size: "700-900 sqft", priceFrom: 1800000 },
      { type: "2 Bedroom", size: "1100-1400 sqft", priceFrom: 3200000 },
      { type: "3 Bedroom", size: "1600-2000 sqft", priceFrom: 5500000 },
      { type: "4 Bedroom", size: "2500-3000 sqft", priceFrom: 8500000 }
    ],
    amenities: ["Marina", "Beach Access", "Golf Course", "Shopping Mall", "Schools", "Healthcare"],
    keyHighlights: [
      "Waterfront living experience",
      "World-class marina facilities",
      "Integrated community design",
      "Sustainable development",
      "Investment opportunity"
    ],
    paymentPlan: "10% on booking, 70% during construction, 20% on completion",
    roi: "7-9%",
    handoverDate: "Q4 2026",
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-21T00:00:00.000Z"
  },
  {
    _id: "3",
    id: "3",
    title: "Sobha Hartland II",
    description: "A premium residential development offering luxury villas and apartments in a green, family-friendly environment.",
    priceRange: {
      min: 2200000,
      max: 18000000,
      currency: "AED"
    },
    location: "Mohammed Bin Rashid City",
    area: "Dubai",
    country: "UAE",
    status: "under-construction",
    completionDate: "2025-09-30",
    launchDate: "2022-11-20",
    developer: "Sobha Realty",
    architect: "Sobha Design Studio",
    totalUnits: 300,
    availableUnits: 75,
    projectType: "Residential",
    category: "luxury",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
    ],
    unitTypes: [
      { type: "2 Bedroom Apartment", size: "1200-1500 sqft", priceFrom: 2200000 },
      { type: "3 Bedroom Apartment", size: "1800-2200 sqft", priceFrom: 3800000 },
      { type: "4 Bedroom Villa", size: "3500-4000 sqft", priceFrom: 8500000 },
      { type: "5 Bedroom Villa", size: "5000-6000 sqft", priceFrom: 18000000 }
    ],
    amenities: ["Central Park", "Swimming Pools", "Fitness Center", "Kids Play Area", "Retail Outlets", "Community Center"],
    keyHighlights: [
      "Green living environment",
      "Family-oriented community",
      "Premium build quality",
      "Strategic location",
      "Excellent connectivity"
    ],
    paymentPlan: "20% on booking, 50% during construction, 30% on completion",
    roi: "6-8%",
    handoverDate: "Q3 2025",
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-22T00:00:00.000Z"
  },
  {
    _id: "4",
    id: "4",
    title: "Damac Hills 2",
    description: "A master-planned community offering contemporary living with world-class amenities and recreational facilities.",
    priceRange: {
      min: 1500000,
      max: 8500000,
      currency: "AED"
    },
    location: "Damac Hills 2",
    area: "Dubai",
    country: "UAE",
    status: "selling",
    completionDate: "2024-12-31",
    launchDate: "2021-08-15",
    developer: "Damac Properties",
    architect: "Damac Design Team",
    totalUnits: 800,
    availableUnits: 120,
    projectType: "Community",
    category: "mid-market",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
    ],
    unitTypes: [
      { type: "1 Bedroom Apartment", size: "600-800 sqft", priceFrom: 1500000 },
      { type: "2 Bedroom Apartment", size: "900-1200 sqft", priceFrom: 2400000 },
      { type: "3 Bedroom Townhouse", size: "1800-2200 sqft", priceFrom: 4200000 },
      { type: "4 Bedroom Villa", size: "2800-3200 sqft", priceFrom: 6800000 }
    ],
    amenities: ["Water Park", "Adventure Park", "Golf Course", "Shopping Center", "Schools", "Healthcare"],
    keyHighlights: [
      "Family-friendly community",
      "Affordable luxury living",
      "Comprehensive amenities",
      "Easy payment plans",
      "Ready to move options"
    ],
    paymentPlan: "5% on booking, 75% during construction, 20% on completion",
    roi: "5-7%",
    handoverDate: "Q4 2024",
    createdAt: "2024-01-04T00:00:00.000Z",
    updatedAt: "2024-01-23T00:00:00.000Z"
  },
  {
    _id: "5",
    id: "5",
    title: "Dubai South by Mag",
    description: "A modern residential development near Al Maktoum International Airport, perfect for aviation professionals and investors.",
    priceRange: {
      min: 800000,
      max: 4500000,
      currency: "AED"
    },
    location: "Dubai South",
    area: "Dubai",
    country: "UAE",
    status: "pre-launch",
    completionDate: "2027-03-31",
    launchDate: "2024-06-01",
    developer: "Mag Properties",
    architect: "Mag Design Studio",
    totalUnits: 600,
    availableUnits: 600,
    projectType: "Residential",
    category: "affordable",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
    ],
    unitTypes: [
      { type: "Studio", size: "400-500 sqft", priceFrom: 800000 },
      { type: "1 Bedroom", size: "600-750 sqft", priceFrom: 1200000 },
      { type: "2 Bedroom", size: "900-1100 sqft", priceFrom: 2100000 },
      { type: "3 Bedroom", size: "1300-1600 sqft", priceFrom: 3200000 }
    ],
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Retail", "Community Garden"],
    keyHighlights: [
      "Airport proximity advantage",
      "Affordable investment option",
      "Growing area potential",
      "Modern design and amenities",
      "Flexible payment plans"
    ],
    paymentPlan: "10% on booking, 60% during construction, 30% on completion",
    roi: "8-12%",
    handoverDate: "Q1 2027",
    createdAt: "2024-01-05T00:00:00.000Z",
    updatedAt: "2024-01-24T00:00:00.000Z"
  }
];

export default projects;