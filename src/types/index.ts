export type SpeciesCategory = 'mammal' | 'bird' | 'aquatic' | 'reptile' | 'amphibian' | 'other';

export interface Pet {
  id: string;
  name: string;
  species: string;
  category: SpeciesCategory;
  breed?: string;
  ageYears: number;
  ageMonths: number;
  weightKg: number;
  photoUrl: string;
  bio?: string;
  createdAt: string;
  moodScore: number;
  streakDays: number;
  colorTheme?: string;
}

export type CareTaskCategory = 'feeding' | 'water' | 'cleaning' | 'exercise' | 'health' | 'enrichment';

export interface CareTask {
  id: string;
  petId: string;
  title: string;
  description: string;
  category: CareTaskCategory;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  completed: boolean;
  completedAt?: string;
  points: number;
}

export type HealthLogType = 'weight' | 'vaccination' | 'medication' | 'vet_visit' | 'symptom' | 'mood';

export interface HealthLog {
  id: string;
  petId: string;
  date: string;
  type: HealthLogType;
  title: string;
  value?: number;
  unit?: string;
  notes?: string;
  vetName?: string;
  nextDueDate?: string;
}

export interface Medication {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions: string;
  active: boolean;
  lastGiven?: string;
}

export type ExpenseCategory = 'food' | 'vet' | 'supplies' | 'grooming' | 'medicine' | 'toys' | 'other';

export interface Expense {
  id: string;
  petId: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  description: string;
  merchant?: string;
}

export interface SymptomCheckResult {
  symptomSummary: string;
  urgencyLevel: 'normal' | 'monitor' | 'urgent' | 'emergency';
  possibleCauses: string[];
  recommendations: string[];
  disclaimer: string;
  suggestedVetSpecialty?: string;
  isEmergencyRedirect: boolean;
}

export interface ChatMessage {
  id: string;
  petId: string;
  sender: 'user' | 'assistant' | 'emergency';
  text: string;
  timestamp: string;
  imageUrl?: string;
  isEmergency?: boolean;
  emergencyActionUrl?: string;
  symptomCheckResult?: SymptomCheckResult;
}

export interface StoreOption {
  storeName: 'Amazon' | 'Flipkart' | 'Chewy' | 'Petco' | 'PetSmart' | 'Supertails' | 'Blinkit' | 'Heads Up For Tails' | 'JioMart' | 'Specialty Pet Direct' | string;
  storeLogo: string;
  price: number;
  currency: string;
  rating: number;
  deliveryDays: number;
  deliveryDateFormatted: string;
  isLowestPrice: boolean;
  isFastestDelivery: boolean;
  isArrivingSoon: boolean;
  productUrl: string;
  inStock: boolean;
}

export interface ProductComparison {
  id: string;
  title: string;
  description: string;
  speciesCategory: SpeciesCategory;
  targetSpeciesTag: string;
  productCategory: string;
  imageUrl: string;
  overallRating: number;
  reviewCount: number;
  stores: StoreOption[];
  bestPick: {
    storeName: string;
    reason: string;
  };
  tags: string[];
}

export interface VetClinic {
  id: string;
  name: string;
  distanceKm: number;
  address: string;
  phone?: string;
  website?: string;
  isOpenNow: boolean;
  hours: string;
  rating: number;
  reviewCount: number;
  latitude: number;
  longitude: number;
  specialties: string[];
  isEmergency247: boolean;
  matchingSpeciesTag?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isGuest: boolean;
  preferredCurrency: string;
  aiApiKey?: string;
  aiProvider?: 'gemini' | 'anthropic' | 'openai' | 'mock';
  notificationsEnabled: boolean;
}
