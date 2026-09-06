import { Pet, CareTask, HealthLog, Medication, Expense, ChatMessage } from '../types';

export const INITIAL_PETS: Pet[] = [
  {
    id: 'pet-1',
    name: 'Milo',
    species: 'Golden Retriever',
    category: 'mammal',
    breed: 'English Cream',
    ageYears: 3,
    ageMonths: 2,
    weightKg: 31.4,
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    bio: 'Energetic, tennis ball obsessed, loves swimming & freeze-dried liver treats.',
    createdAt: '2024-01-15T08:00:00Z',
    moodScore: 94,
    streakDays: 14,
    colorTheme: 'from-amber-400 to-orange-500',
  },
  {
    id: 'pet-2',
    name: 'Luna',
    species: 'Cockatiel',
    category: 'bird',
    breed: 'Lutino Yellow Crest',
    ageYears: 1,
    ageMonths: 6,
    weightKg: 0.095, // 95g
    photoUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
    bio: 'Whistles Andy Griffith theme, loves head scritches & millet spray.',
    createdAt: '2024-03-10T10:00:00Z',
    moodScore: 88,
    streakDays: 9,
    colorTheme: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'pet-3',
    name: 'Bubbles',
    species: 'Betta Fish',
    category: 'aquatic',
    breed: 'Halfmoon Dragonscale',
    ageYears: 0,
    ageMonths: 8,
    weightKg: 0.003, // 3g
    photoUrl: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
    bio: 'Resides in a 5-gal planted tank. Flairs proudly at his mirror enrichment toy.',
    createdAt: '2024-06-01T12:00:00Z',
    moodScore: 92,
    streakDays: 21,
    colorTheme: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'pet-4',
    name: 'Rex',
    species: 'Bearded Dragon',
    category: 'reptile',
    breed: 'Citrus Hypo Trans',
    ageYears: 2,
    ageMonths: 1,
    weightKg: 0.46, // 460g
    photoUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
    bio: 'Basks under 100°F heat lamp, loves dubia roaches & organic dandelion greens.',
    createdAt: '2024-02-20T09:00:00Z',
    moodScore: 90,
    streakDays: 11,
    colorTheme: 'from-emerald-400 to-teal-600',
  }
];

export const INITIAL_CARE_TASKS: Record<string, CareTask[]> = {
  'pet-1': [
    {
      id: 'task-1-1',
      petId: 'pet-1',
      title: 'Morning Kibble & Glucosamine',
      description: '1.5 cups premium salmon & rice formula + 1 joint supplement chew',
      category: 'feeding',
      timeOfDay: 'morning',
      completed: true,
      completedAt: new Date().toISOString(),
      points: 15,
    },
    {
      id: 'task-1-2',
      petId: 'pet-1',
      title: 'Fresh Water Refill',
      description: 'Clean bowl and fill with filtered chilled water',
      category: 'water',
      timeOfDay: 'morning',
      completed: true,
      completedAt: new Date().toISOString(),
      points: 10,
    },
    {
      id: 'task-1-3',
      petId: 'pet-1',
      title: '45-Min Park Fetch & Walk',
      description: 'Cardio exercise and sniff exploration along trail',
      category: 'exercise',
      timeOfDay: 'afternoon',
      completed: false,
      points: 25,
    },
    {
      id: 'task-1-4',
      petId: 'pet-1',
      title: 'Evening Meal & Dental Chew',
      description: '1.5 cups salmon formula + 1 enzymatic dental chew stick',
      category: 'feeding',
      timeOfDay: 'evening',
      completed: false,
      points: 15,
    },
    {
      id: 'task-1-5',
      petId: 'pet-1',
      title: 'Coat Brushing & Tick Check',
      description: '5-min undercoat de-shedding brush & paw inspection',
      category: 'enrichment',
      timeOfDay: 'evening',
      completed: false,
      points: 15,
    }
  ],
  'pet-2': [
    {
      id: 'task-2-1',
      petId: 'pet-2',
      title: 'Seed & Pellet Refresh',
      description: 'Blow off seed husks, provide 2 tbsp Harrison pellets + seed mix',
      category: 'feeding',
      timeOfDay: 'morning',
      completed: true,
      completedAt: new Date().toISOString(),
      points: 15,
    },
    {
      id: 'task-2-2',
      petId: 'pet-2',
      title: 'Fresh Water & Mist Bath',
      description: 'Sanitize water tube and offer lukewarm gentle mist spray',
      category: 'water',
      timeOfDay: 'morning',
      completed: true,
      completedAt: new Date().toISOString(),
      points: 15,
    },
    {
      id: 'task-2-3',
      petId: 'pet-2',
      title: 'Cage Tray Paper Change',
      description: 'Replace bottom lining sheet & inspect droppings consistency',
      category: 'cleaning',
      timeOfDay: 'afternoon',
      completed: false,
      points: 20,
    },
    {
      id: 'task-2-4',
      petId: 'pet-2',
      title: 'Out-of-Cage Flight & Social Time',
      description: '30 mins supervised wing flight and shoulder perch bonding',
      category: 'enrichment',
      timeOfDay: 'evening',
      completed: false,
      points: 25,
    }
  ],
  'pet-3': [
    {
      id: 'task-3-1',
      petId: 'pet-3',
      title: 'Morning Micro-Pellets',
      description: '4 soaked high-protein Betta Pro pellets',
      category: 'feeding',
      timeOfDay: 'morning',
      completed: true,
      completedAt: new Date().toISOString(),
      points: 15,
    },
    {
      id: 'task-3-2',
      petId: 'pet-3',
      title: 'Water Temp & Filter Flow Check',
      description: 'Confirm 78°F - 80°F on digital thermometer, check low current',
      category: 'health',
      timeOfDay: 'morning',
      completed: true,
      completedAt: new Date().toISOString(),
      points: 15,
    },
    {
      id: 'task-3-3',
      petId: 'pet-3',
      title: '20% Water Parameter Testing & Change',
      description: 'Dechlorinate with Prime, check ammonia 0ppm, nitrate <20ppm',
      category: 'cleaning',
      timeOfDay: 'afternoon',
      completed: false,
      points: 30,
    },
    {
      id: 'task-3-4',
      petId: 'pet-3',
      title: '5-Min Mirror Flare Enrichment',
      description: 'Stimulate fin expansion & natural behavioral vitality',
      category: 'enrichment',
      timeOfDay: 'evening',
      completed: false,
      points: 15,
    }
  ],
  'pet-4': [
    {
      id: 'task-4-1',
      petId: 'pet-4',
      title: 'UVB Lamp & Basking Thermostat On',
      description: 'Confirm basking surface reaches 100°F-105°F, cool side 78°F',
      category: 'health',
      timeOfDay: 'morning',
      completed: true,
      completedAt: new Date().toISOString(),
      points: 20,
    },
    {
      id: 'task-4-2',
      petId: 'pet-4',
      title: 'Fresh Greens with Calcium Powder',
      description: 'Chopped collard greens & butternut squash dusted with Ca+D3',
      category: 'feeding',
      timeOfDay: 'morning',
      completed: true,
      completedAt: new Date().toISOString(),
      points: 20,
    },
    {
      id: 'task-4-3',
      petId: 'pet-4',
      title: 'Live Dubia Roaches Feeding',
      description: '8 gut-loaded live roaches dusted with multivitamin',
      category: 'feeding',
      timeOfDay: 'afternoon',
      completed: false,
      points: 20,
    },
    {
      id: 'task-4-4',
      petId: 'pet-4',
      title: 'Substrate Spot Cleaning & Warm Soak',
      description: 'Remove waste and offer 10-min warm hydration bath',
      category: 'cleaning',
      timeOfDay: 'evening',
      completed: false,
      points: 20,
    }
  ]
};

export const INITIAL_HEALTH_LOGS: HealthLog[] = [
  {
    id: 'hl-1',
    petId: 'pet-1',
    date: '2026-08-15',
    type: 'vaccination',
    title: 'Rabies 3-Year Booster & DHPP',
    notes: 'Administered right shoulder. No adverse allergic reaction observed.',
    vetName: 'Dr. Sarah Jenkins (Paws & Claws Clinic)',
    nextDueDate: '2029-08-15',
  },
  {
    id: 'hl-2',
    petId: 'pet-1',
    date: '2026-08-28',
    type: 'weight',
    title: 'Routine Monthly Weigh-in',
    value: 31.4,
    unit: 'kg',
    notes: 'Optimal athletic body condition score: 5/9.',
  },
  {
    id: 'hl-3',
    petId: 'pet-1',
    date: '2026-07-20',
    type: 'weight',
    title: 'Summer Weigh-in',
    value: 31.0,
    unit: 'kg',
    notes: 'Healthy baseline maintained.',
  },
  {
    id: 'hl-4',
    petId: 'pet-2',
    date: '2026-08-10',
    type: 'vet_visit',
    title: 'Annual Avian Wellness & Beak Check',
    notes: 'Beak symmetrical, clear nares, feather condition lustrous.',
    vetName: 'Dr. Alan Vance (Avian & Exotic Medical Center)',
    nextDueDate: '2027-08-10',
  },
  {
    id: 'hl-5',
    petId: 'pet-4',
    date: '2026-08-01',
    type: 'weight',
    title: 'Bearded Dragon Growth Weigh-in',
    value: 460,
    unit: 'g',
    notes: 'Gained 25g following successful tail & back shed.',
  }
];

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    petId: 'pet-1',
    name: 'NexGard Spectra',
    dosage: '1 chewable tablet (30-60kg)',
    frequency: 'Once a month',
    startDate: '2026-08-01',
    instructions: 'Give with evening meal for full flea, tick, heartworm and worm control.',
    active: true,
    lastGiven: '2026-08-01',
  },
  {
    id: 'med-2',
    petId: 'pet-1',
    name: 'Nutramax Cosequin Maximum Strength',
    dosage: '1 tablet daily',
    frequency: 'Daily morning',
    startDate: '2026-01-01',
    instructions: 'Joint and cartilage health supplement with glucosamine & chondroitin.',
    active: true,
    lastGiven: '2026-09-06',
  },
  {
    id: 'med-3',
    petId: 'pet-4',
    name: 'Rep-Cal Calcium with Vitamin D3',
    dosage: 'Light dusting on greens',
    frequency: '3 times weekly',
    startDate: '2026-01-10',
    instructions: 'Prevents Metabolic Bone Disease (MBD) under desert UVB lighting.',
    active: true,
    lastGiven: '2026-09-05',
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    petId: 'pet-1',
    date: '2026-08-28',
    category: 'food',
    amount: 68.50,
    currency: '$',
    description: 'Purina Pro Plan Salmon Sensitive Skin 30lb Bag',
    merchant: 'Chewy'
  },
  {
    id: 'exp-2',
    petId: 'pet-1',
    date: '2026-08-15',
    category: 'vet',
    amount: 145.00,
    currency: '$',
    description: 'Annual Wellness Exam & 3-Year Rabies Vaccine',
    merchant: 'Paws & Claws Clinic'
  },
  {
    id: 'exp-3',
    petId: 'pet-2',
    date: '2026-08-20',
    category: 'supplies',
    amount: 32.00,
    currency: '$',
    description: 'Natural Java Wood Perch & Foraging Toys',
    merchant: 'Amazon'
  },
  {
    id: 'exp-4',
    petId: 'pet-4',
    date: '2026-08-12',
    category: 'supplies',
    amount: 44.99,
    currency: '$',
    description: 'Arcadia Desert 12% UVB T5 Light Tube 24W',
    merchant: 'Petco'
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'pet-1': [
    {
      id: 'msg-1',
      petId: 'pet-1',
      sender: 'assistant',
      text: 'Hello! I am your AI care assistant for **Milo** (Golden Retriever). Ask me anything about feeding amounts, joint supplements, allergy symptoms, or exercise routines!',
      timestamp: '2026-09-06T08:00:00Z',
    }
  ],
  'pet-2': [
    {
      id: 'msg-2',
      petId: 'pet-2',
      sender: 'assistant',
      text: 'Hi there! I am calibrated for **Luna** (Cockatiel). I can assist with safe vegetables, respiratory safety (avoiding Teflon fumes & aerosols), molting care, and behavioral enrichment.',
      timestamp: '2026-09-06T08:00:00Z',
    }
  ],
  'pet-3': [
    {
      id: 'msg-3',
      petId: 'pet-3',
      sender: 'assistant',
      text: 'Welcome! I am ready to help with **Bubbles** (Betta Fish). Need guidance on water parameters (pH, Ammonia, Nitrites), fin rot symptoms, or feeding schedule?',
      timestamp: '2026-09-06T08:00:00Z',
    }
  ],
  'pet-4': [
    {
      id: 'msg-4',
      petId: 'pet-4',
      sender: 'assistant',
      text: 'Greetings! I am tuned for **Rex** (Bearded Dragon). I can help verify enclosure temperature gradients (basking 105°F / cool 78°F), dusting schedules, and impaction prevention.',
      timestamp: '2026-09-06T08:00:00Z',
    }
  ]
};
