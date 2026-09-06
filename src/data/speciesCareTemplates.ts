import { SpeciesCategory, CareTask } from '../types';

export interface CareTemplateTask {
  title: string;
  description: string;
  category: 'feeding' | 'water' | 'cleaning' | 'exercise' | 'health' | 'enrichment';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  points: number;
}

export const SPECIES_CARE_TEMPLATES: Record<SpeciesCategory, CareTemplateTask[]> = {
  mammal: [
    {
      title: 'Morning Balanced Feeding',
      description: 'Portioned kibble/wet food with fresh nutritional supplements',
      category: 'feeding',
      timeOfDay: 'morning',
      points: 15
    },
    {
      title: 'Fresh Water Bowl Refill',
      description: 'Rinse bowl thoroughly and fill with fresh clean water',
      category: 'water',
      timeOfDay: 'morning',
      points: 10
    },
    {
      title: 'Active Exercise & Playtime',
      description: '30-45 mins walk, fetch, agility, or laser/wand toy exercise',
      category: 'exercise',
      timeOfDay: 'afternoon',
      points: 25
    },
    {
      title: 'Evening Meal',
      description: 'Evening portion of balanced species nutrition',
      category: 'feeding',
      timeOfDay: 'evening',
      points: 15
    },
    {
      title: 'Coat & Dental Inspection',
      description: 'Quick brush, check teeth/gums, and inspect paws & ears',
      category: 'health',
      timeOfDay: 'evening',
      points: 15
    }
  ],
  bird: [
    {
      title: 'Morning Seeds & Fresh Veggies',
      description: 'Pellets/seed blend with chopped organic greens (kale, broccoli, carrots)',
      category: 'feeding',
      timeOfDay: 'morning',
      points: 15
    },
    {
      title: 'Sanitized Water & Mist Bath',
      description: 'Clean drinker tube and offer gentle lukewarm mist bath',
      category: 'water',
      timeOfDay: 'morning',
      points: 15
    },
    {
      title: 'Cage Tray Paper Refresh',
      description: 'Replace bottom paper liner and inspect droppings for health indicators',
      category: 'cleaning',
      timeOfDay: 'afternoon',
      points: 20
    },
    {
      title: 'Out-of-Cage Social & Flight Time',
      description: 'Supervised wing exercise, vocal interaction, and foraging puzzles',
      category: 'enrichment',
      timeOfDay: 'evening',
      points: 25
    }
  ],
  aquatic: [
    {
      title: 'Morning High-Protein Feeding',
      description: 'Species-appropriate micro-pellets/flakes (only what is eaten in 2 mins)',
      category: 'feeding',
      timeOfDay: 'morning',
      points: 15
    },
    {
      title: 'Water Temp & Filter Current Check',
      description: 'Verify digital thermometer and check filter impeller flow',
      category: 'health',
      timeOfDay: 'morning',
      points: 15
    },
    {
      title: 'Water Parameter & Algae Spot Check',
      description: 'Check water clarity, test strips (ammonia/nitrates), wipe glass',
      category: 'cleaning',
      timeOfDay: 'afternoon',
      points: 25
    },
    {
      title: 'Visual Fin & Gill Health Inspection',
      description: 'Observe swimming behavior, coloration, and breathing rate',
      category: 'health',
      timeOfDay: 'evening',
      points: 15
    }
  ],
  reptile: [
    {
      title: 'UVB & Basking Spot Verification',
      description: 'Confirm basking zone temperature and check UVB bulb runtime',
      category: 'health',
      timeOfDay: 'morning',
      points: 20
    },
    {
      title: 'Dietary Feeding & Calcium Dusting',
      description: 'Fresh chopped greens/insects dusted with calcium + vitamin D3',
      category: 'feeding',
      timeOfDay: 'morning',
      points: 20
    },
    {
      title: 'Hydration Mist / Water Dish Clean',
      description: 'Refill clean shallow bowl and mist habitat if species requires humidity',
      category: 'water',
      timeOfDay: 'afternoon',
      points: 15
    },
    {
      title: 'Enclosure Spot Clean & Waste Removal',
      description: 'Remove fecal matter and inspect shed skin status',
      category: 'cleaning',
      timeOfDay: 'evening',
      points: 20
    }
  ],
  amphibian: [
    {
      title: 'Humidity & Moisture Check',
      description: 'Mist terrarium to maintain optimal species humidity (70-90%)',
      category: 'water',
      timeOfDay: 'morning',
      points: 20
    },
    {
      title: 'Evening Live Insect Feeding',
      description: 'Gut-loaded crickets, earthworms or fruit flies with vitamin dusting',
      category: 'feeding',
      timeOfDay: 'evening',
      points: 20
    },
    {
      title: 'Water Substrate & Dechlorination Check',
      description: 'Ensure all water is treated with amphibian-safe conditioner',
      category: 'cleaning',
      timeOfDay: 'afternoon',
      points: 20
    }
  ],
  other: [
    {
      title: 'Morning Nutrition & Feeding',
      description: 'Species-tailored daily diet and forage',
      category: 'feeding',
      timeOfDay: 'morning',
      points: 20
    },
    {
      title: 'Fresh Water & Environment Check',
      description: 'Verify clean water supply, temperature and enclosure security',
      category: 'water',
      timeOfDay: 'morning',
      points: 20
    },
    {
      title: 'Habitat Cleaning & Sanitation',
      description: 'Spot clean bedding or enclosure surfaces',
      category: 'cleaning',
      timeOfDay: 'afternoon',
      points: 20
    },
    {
      title: 'Daily Wellness & Activity Observation',
      description: 'Observe active movement, appetite, and skin/fur condition',
      category: 'health',
      timeOfDay: 'evening',
      points: 20
    }
  ]
};

export function generateTasksForPet(petId: string, category: SpeciesCategory): CareTask[] {
  const templates = SPECIES_CARE_TEMPLATES[category] || SPECIES_CARE_TEMPLATES.other;
  return templates.map((tmpl, idx) => ({
    id: `task-${petId}-${idx + 1}`,
    petId,
    title: tmpl.title,
    description: tmpl.description,
    category: tmpl.category,
    timeOfDay: tmpl.timeOfDay,
    completed: false,
    points: tmpl.points,
  }));
}
