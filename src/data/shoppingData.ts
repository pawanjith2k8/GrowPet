import { ProductComparison, SpeciesCategory } from '../types';

export interface SpeciesQuickChip {
  label: string;
  query: string;
  iconName: string;
}

export const SPECIES_QUICK_CHIPS: Record<SpeciesCategory, SpeciesQuickChip[]> = {
  mammal: [
    { label: 'Grain-Free Salmon Food', query: 'salmon grain free dog food', iconName: 'Bone' },
    { label: 'Enzymatic Dental Chews', query: 'enzymatic dental chews dogs', iconName: 'Sparkles' },
    { label: 'Orthopedic Memory Foam Bed', query: 'orthopedic dog bed large', iconName: 'Bed' },
    { label: 'Flea & Tick Prevention', query: 'flea and tick collar chewable', iconName: 'Shield' },
    { label: 'No-Pull Tactical Harness', query: 'no pull dog harness reflective', iconName: 'Tag' }
  ],
  bird: [
    { label: 'Harrison Pellets & Seed Mix', query: 'cockatiel organic pellets seed mix', iconName: 'Feather' },
    { label: 'Natural Java Wood Perch', query: 'natural wood bird perch multi branch', iconName: 'TreePine' },
    { label: 'Mineral Cuttlebone with Clip', query: 'bird cuttlebone calcium mineral block', iconName: 'Zap' },
    { label: 'Foraging Shredding Toys', query: 'foraging bird toys safe dyed wood', iconName: 'Gift' },
    { label: 'Spacious Flight Cage', query: 'large bird flight cage 30 inch', iconName: 'Home' }
  ],
  aquatic: [
    { label: 'Nano Sponge Aquarium Filter', query: 'aquarium sponge filter nano quiet', iconName: 'Fish' },
    { label: 'Seachem Prime Conditioner', query: 'seachem prime water conditioner 500ml', iconName: 'Droplets' },
    { label: 'Preset 50W Submersible Heater', query: 'aquarium submersible heater 50w betta', iconName: 'Flame' },
    { label: 'Fluval Bug Bites Betta Formula', query: 'fluval bug bites betta micro granules', iconName: 'Utensils' },
    { label: 'Live Anubias Plant Driftwood', query: 'live aquarium plants anubias on wood', iconName: 'Leaf' }
  ],
  reptile: [
    { label: 'Arcadia ProT5 UVB 12% Kit', query: 'arcadia prot5 12 uvb lighting kit 24w', iconName: 'Sun' },
    { label: 'Rep-Cal Calcium with D3', query: 'rep-cal calcium with vitamin d3 powder', iconName: 'Sparkles' },
    { label: 'Ceramic Heat Emitter 75W', query: 'ceramic heat emitter reptile 75w', iconName: 'Flame' },
    { label: 'Natural Basking Rock Cave', query: 'reptile basking slate rock platform hide', iconName: 'Mountain' },
    { label: 'Live Gut-Loaded Dubia Roaches', query: 'live dubia roaches medium feeder count', iconName: 'Bug' }
  ],
  amphibian: [
    { label: 'Reptile Terrarium Fogger / Mister', query: 'automatic terrarium mister fogger', iconName: 'CloudRain' },
    { label: 'Exo Terra Plantation Soil', query: 'coconut fiber substrate amphibian', iconName: 'Layers' },
    { label: 'Zoo Med ReptiVite Multivitamin', query: 'reptivite amphibian multivitamin without d3', iconName: 'Pill' },
    { label: 'Bioactive Springtails & Isopods', query: 'bioactive clean up crew isopods springtails', iconName: 'Bug' }
  ],
  other: [
    { label: 'Premium Multi-Species Diet', query: 'premium organic small animal pet food', iconName: 'Package' },
    { label: 'Digital Thermometer & Hygrometer', query: 'digital pet enclosure thermometer hygrometer', iconName: 'Gauge' },
    { label: 'Natural Chew Enrichment Toys', query: 'natural wood chew toys pet enrichment', iconName: 'Smile' },
    { label: 'Hypoallergenic Enclosure Bedding', query: 'dust free paper pet bedding 50l', iconName: 'ShieldCheck' }
  ]
};

export const INITIAL_PRODUCTS: ProductComparison[] = [
  // Mammal products
  {
    id: 'prod-1',
    title: 'Purina Pro Plan Sensitive Skin & Stomach Salmon Adult Formula (30 lb)',
    description: 'High-protein real salmon first ingredient with live probiotics and prebiotic fiber for sensitive digestive health.',
    speciesCategory: 'mammal',
    targetSpeciesTag: 'Dog / Mammal',
    productCategory: 'Food',
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
    overallRating: 4.8,
    reviewCount: 14200,
    tags: ['Food', 'Sensitive Stomach', 'High Protein', 'Salmon'],
    bestPick: {
      storeName: 'Chewy',
      reason: 'Lowest price with free 1-2 day express autoship delivery and freshest batch guarantee.'
    },
    stores: [
      {
        storeName: 'Chewy',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Chewy_logo.svg',
        price: 68.48,
        currency: '$',
        rating: 4.9,
        deliveryDays: 1,
        deliveryDateFormatted: 'Tomorrow by 5 PM',
        isLowestPrice: true,
        isFastestDelivery: true,
        isArrivingSoon: true,
        productUrl: 'https://www.chewy.com/s?query=Purina+Pro+Plan+Sensitive+Skin+Salmon+30+lb',
        inStock: true
      },
      {
        storeName: 'Amazon',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        price: 71.99,
        currency: '$',
        rating: 4.8,
        deliveryDays: 2,
        deliveryDateFormatted: 'In 2 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: true,
        productUrl: 'https://www.amazon.com/s?k=Purina+Pro+Plan+Sensitive+Skin+Salmon+30+lb',
        inStock: true
      },
      {
        storeName: 'Supertails',
        storeLogo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=100&q=80',
        price: 69.99,
        currency: '$',
        rating: 4.8,
        deliveryDays: 1,
        deliveryDateFormatted: 'Tomorrow Express',
        isLowestPrice: false,
        isFastestDelivery: true,
        isArrivingSoon: true,
        productUrl: 'https://supertails.com/search?q=Purina+Pro+Plan+Salmon',
        inStock: true
      },
      {
        storeName: 'PetSmart',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/02/PetSmart_logo.svg',
        price: 73.99,
        currency: '$',
        rating: 4.7,
        deliveryDays: 2,
        deliveryDateFormatted: 'In 2 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: true,
        productUrl: 'https://www.petsmart.com/search/?q=Purina+Pro+Plan+Salmon+30+lb',
        inStock: true
      },
      {
        storeName: 'Petco',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Petco_logo.svg',
        price: 74.99,
        currency: '$',
        rating: 4.7,
        deliveryDays: 3,
        deliveryDateFormatted: 'In 3 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: false,
        productUrl: 'https://www.petco.com/shop/en/petcostore/search?query=Purina+Pro+Plan+Sensitive+Skin+Salmon+30+lb',
        inStock: true
      },
      {
        storeName: 'Flipkart',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg',
        price: 78.50,
        currency: '$',
        rating: 4.6,
        deliveryDays: 4,
        deliveryDateFormatted: 'In 4 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: false,
        productUrl: 'https://www.flipkart.com/search?q=Purina+Pro+Plan+Salmon+Dog+Food',
        inStock: true
      },
      {
        storeName: 'Blinkit',
        storeLogo: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=100&q=80',
        price: 72.50,
        currency: '$',
        rating: 4.9,
        deliveryDays: 0,
        deliveryDateFormatted: '15 Mins Instant',
        isLowestPrice: false,
        isFastestDelivery: true,
        isArrivingSoon: true,
        productUrl: 'https://blinkit.com/s/?q=Purina+Pro+Plan+Salmon',
        inStock: true
      }
    ]
  },
  {
    id: 'prod-2',
    title: 'Nutramax Cosequin Maximum Strength Joint Health Chewable Tablets (132 Count)',
    description: 'Veterinarian recommended #1 brand for dog joint mobility with Glucosamine, Chondroitin, and MSM.',
    speciesCategory: 'mammal',
    targetSpeciesTag: 'Dog / Mammal',
    productCategory: 'Health',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    overallRating: 4.9,
    reviewCount: 22800,
    tags: ['Health', 'Joints', 'Supplements', 'Vet Recommended'],
    bestPick: {
      storeName: 'Amazon',
      reason: 'Amazon Prime next-morning delivery with coupon clip discount applied.'
    },
    stores: [
      {
        storeName: 'Amazon',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        price: 36.99,
        currency: '$',
        rating: 4.9,
        deliveryDays: 1,
        deliveryDateFormatted: 'Tomorrow by 11 AM',
        isLowestPrice: true,
        isFastestDelivery: true,
        isArrivingSoon: true,
        productUrl: 'https://www.amazon.com/s?k=Nutramax+Cosequin+Maximum+Strength+132',
        inStock: true
      },
      {
        storeName: 'Chewy',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Chewy_logo.svg',
        price: 38.99,
        currency: '$',
        rating: 4.9,
        deliveryDays: 2,
        deliveryDateFormatted: 'In 2 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: true,
        productUrl: 'https://www.chewy.com/s?query=Nutramax+Cosequin+Maximum+Strength+132',
        inStock: true
      },
      {
        storeName: 'Petco',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Petco_logo.svg',
        price: 41.99,
        currency: '$',
        rating: 4.8,
        deliveryDays: 3,
        deliveryDateFormatted: 'In 3 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: false,
        productUrl: 'https://www.petco.com/shop/en/petcostore/search?query=Nutramax+Cosequin+132',
        inStock: true
      }
    ]
  },
  // Bird products
  {
    id: 'prod-3',
    title: "Harrison's High Potency Super Fine Certified Organic Bird Food (1 lb)",
    description: 'Premium veterinarian-formulated certified organic pellets for cockatiels, conures, parakeets, and small parrots.',
    speciesCategory: 'bird',
    targetSpeciesTag: 'Cockatiel / Bird',
    productCategory: 'Food',
    imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80',
    overallRating: 4.9,
    reviewCount: 3840,
    tags: ['Food', 'Organic', 'Pellets', 'Avian Vet Approved'],
    bestPick: {
      storeName: 'Specialty Pet Direct',
      reason: 'Fresh sealed batch straight from Harrison Avian distribution with cold-chain storage.'
    },
    stores: [
      {
        storeName: 'Specialty Pet Direct',
        storeLogo: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=100&q=80',
        price: 15.99,
        currency: '$',
        rating: 5.0,
        deliveryDays: 2,
        deliveryDateFormatted: 'In 2 days',
        isLowestPrice: true,
        isFastestDelivery: false,
        isArrivingSoon: true,
        productUrl: 'https://www.harrisonsbirdfoods.com/search.php?search_query=High+Potency+Super+Fine',
        inStock: true
      },
      {
        storeName: 'Amazon',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        price: 18.25,
        currency: '$',
        rating: 4.8,
        deliveryDays: 1,
        deliveryDateFormatted: 'Tomorrow by 2 PM',
        isLowestPrice: false,
        isFastestDelivery: true,
        isArrivingSoon: true,
        productUrl: 'https://www.amazon.com/s?k=Harrisons+High+Potency+Super+Fine+1lb',
        inStock: true
      },
      {
        storeName: 'Chewy',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Chewy_logo.svg',
        price: 17.50,
        currency: '$',
        rating: 4.9,
        deliveryDays: 3,
        deliveryDateFormatted: 'In 3 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: false,
        productUrl: 'https://www.chewy.com/s?query=Harrisons+Bird+Foods+High+Potency',
        inStock: true
      }
    ]
  },
  {
    id: 'prod-4',
    title: 'Prevue Hendryx Wrought Iron Flight Cage with Stand (31-Inch)',
    description: 'Heavy duty wrought iron non-toxic finish, large front door with safety lock, bottom pull out grille and tray.',
    speciesCategory: 'bird',
    targetSpeciesTag: 'Bird / Habitat',
    productCategory: 'Habitat',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
    overallRating: 4.7,
    reviewCount: 5120,
    tags: ['Cage', 'Habitat', 'Flight Cage', 'Bird'],
    bestPick: {
      storeName: 'Amazon',
      reason: 'Free oversized freight shipping arriving in 2 business days with 15% discount.'
    },
    stores: [
      {
        storeName: 'Amazon',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        price: 139.99,
        currency: '$',
        rating: 4.7,
        deliveryDays: 2,
        deliveryDateFormatted: 'In 2 days',
        isLowestPrice: true,
        isFastestDelivery: true,
        isArrivingSoon: true,
        productUrl: 'https://www.amazon.com/s?k=Prevue+Hendryx+Wrought+Iron+Flight+Cage+F040',
        inStock: true
      },
      {
        storeName: 'Petco',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Petco_logo.svg',
        price: 159.99,
        currency: '$',
        rating: 4.6,
        deliveryDays: 4,
        deliveryDateFormatted: 'In 4 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: false,
        productUrl: 'https://www.petco.com/shop/en/petcostore/search?query=Prevue+Flight+Cage',
        inStock: true
      },
      {
        storeName: 'Flipkart',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg',
        price: 165.00,
        currency: '$',
        rating: 4.5,
        deliveryDays: 5,
        deliveryDateFormatted: 'In 5 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: false,
        productUrl: 'https://www.flipkart.com/search?q=Prevue+Bird+Flight+Cage',
        inStock: true
      }
    ]
  },
  // Aquatic products
  {
    id: 'prod-5',
    title: 'Seachem Prime Complete Water Conditioner & Dechlorinator (500 ml)',
    description: 'Removes chlorine, chloramine, and detoxifies ammonia, nitrite & heavy metals in fresh and saltwater.',
    speciesCategory: 'aquatic',
    targetSpeciesTag: 'Betta / Aquatic',
    productCategory: 'Water Care',
    imageUrl: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80',
    overallRating: 4.9,
    reviewCount: 34100,
    tags: ['Water Care', 'Dechlorinator', 'Aquarium', 'Fish Safe'],
    bestPick: {
      storeName: 'Chewy',
      reason: 'Lowest price per ml with instant same-day dispatch.'
    },
    stores: [
      {
        storeName: 'Chewy',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Chewy_logo.svg',
        price: 13.89,
        currency: '$',
        rating: 4.9,
        deliveryDays: 1,
        deliveryDateFormatted: 'Tomorrow by 6 PM',
        isLowestPrice: true,
        isFastestDelivery: true,
        isArrivingSoon: true,
        productUrl: 'https://www.chewy.com/s?query=Seachem+Prime+Water+Conditioner+500ml',
        inStock: true
      },
      {
        storeName: 'Amazon',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        price: 14.99,
        currency: '$',
        rating: 4.9,
        deliveryDays: 2,
        deliveryDateFormatted: 'In 2 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: true,
        productUrl: 'https://www.amazon.com/s?k=Seachem+Prime+Water+Conditioner+500ml',
        inStock: true
      },
      {
        storeName: 'Petco',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Petco_logo.svg',
        price: 16.49,
        currency: '$',
        rating: 4.8,
        deliveryDays: 3,
        deliveryDateFormatted: 'In 3 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: false,
        productUrl: 'https://www.petco.com/shop/en/petcostore/search?query=Seachem+Prime+500ml',
        inStock: true
      },
      {
        storeName: 'Flipkart',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg',
        price: 18.00,
        currency: '$',
        rating: 4.7,
        deliveryDays: 4,
        deliveryDateFormatted: 'In 4 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: false,
        productUrl: 'https://www.flipkart.com/search?q=Seachem+Prime+Water+Conditioner',
        inStock: true
      }
    ]
  },
  {
    id: 'prod-6',
    title: 'Fluval Aquasky 2.0 Bluetooth LED Aquarium Light (12-16W)',
    description: 'Fully programmable 24-hour light cycle, simulates natural sunrise, midday, sunset & moonlight with IP67 waterproofing.',
    speciesCategory: 'aquatic',
    targetSpeciesTag: 'Aquatic / Lighting',
    productCategory: 'Habitat',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    overallRating: 4.7,
    reviewCount: 6890,
    tags: ['Lighting', 'Planted Tank', 'Bluetooth', 'Aquarium'],
    bestPick: {
      storeName: 'Amazon',
      reason: 'Arrives tomorrow with Amazon fulfillment & manufacturer warranty.'
    },
    stores: [
      {
        storeName: 'Amazon',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        price: 54.99,
        currency: '$',
        rating: 4.8,
        deliveryDays: 1,
        deliveryDateFormatted: 'Tomorrow by 1 PM',
        isLowestPrice: true,
        isFastestDelivery: true,
        isArrivingSoon: true,
        productUrl: 'https://www.amazon.com/s?k=Fluval+Aquasky+2.0+Bluetooth+LED',
        inStock: true
      },
      {
        storeName: 'Petco',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Petco_logo.svg',
        price: 59.99,
        currency: '$',
        rating: 4.7,
        deliveryDays: 3,
        deliveryDateFormatted: 'In 3 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: false,
        productUrl: 'https://www.petco.com/shop/en/petcostore/search?query=Fluval+Aquasky+2.0',
        inStock: true
      }
    ]
  },
  // Reptile products
  {
    id: 'prod-7',
    title: 'Arcadia ProT5 Desert UVB 12% Fixture and Bulb Kit (24W / 22-Inch)',
    description: 'Essential flicker-free T5 UVB lighting for desert species like Bearded Dragons to synthesize Vitamin D3 & prevent MBD.',
    speciesCategory: 'reptile',
    targetSpeciesTag: 'Bearded Dragon / Reptile',
    productCategory: 'Habitat',
    imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80',
    overallRating: 4.9,
    reviewCount: 4210,
    tags: ['UVB', 'Lighting', 'Desert Reptiles', 'Arcadia'],
    bestPick: {
      storeName: 'Specialty Pet Direct',
      reason: 'Specialist fragile packaging for glass bulbs with guaranteed unbroken delivery.'
    },
    stores: [
      {
        storeName: 'Specialty Pet Direct',
        storeLogo: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=100&q=80',
        price: 64.95,
        currency: '$',
        rating: 5.0,
        deliveryDays: 2,
        deliveryDateFormatted: 'In 2 days',
        isLowestPrice: true,
        isFastestDelivery: false,
        isArrivingSoon: true,
        productUrl: 'https://www.reptilebasics.com/search?keywords=Arcadia+ProT5+12%25+24W',
        inStock: true
      },
      {
        storeName: 'Amazon',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        price: 69.99,
        currency: '$',
        rating: 4.8,
        deliveryDays: 1,
        deliveryDateFormatted: 'Tomorrow by 4 PM',
        isLowestPrice: false,
        isFastestDelivery: true,
        isArrivingSoon: true,
        productUrl: 'https://www.amazon.com/s?k=Arcadia+ProT5+12+UVB+Kit+24W',
        inStock: true
      },
      {
        storeName: 'Petco',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Petco_logo.svg',
        price: 74.99,
        currency: '$',
        rating: 4.7,
        deliveryDays: 3,
        deliveryDateFormatted: 'In 3 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: false,
        productUrl: 'https://www.petco.com/shop/en/petcostore/search?query=Arcadia+ProT5+12',
        inStock: true
      }
    ]
  },
  {
    id: 'prod-8',
    title: 'Rep-Cal Phosphorus-Free Calcium with Vitamin D3 Ultrafine Powder (3.3 oz)',
    description: 'Scientifically formulated from 100% natural oyster shell flour, essential for captive reptiles without sunlight.',
    speciesCategory: 'reptile',
    targetSpeciesTag: 'Reptile / Nutrition',
    productCategory: 'Health',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    overallRating: 4.9,
    reviewCount: 8900,
    tags: ['Calcium', 'Vitamins', 'Reptile Health', 'Dusting'],
    bestPick: {
      storeName: 'Chewy',
      reason: 'Lowest price with freshest seal expiration date.'
    },
    stores: [
      {
        storeName: 'Chewy',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Chewy_logo.svg',
        price: 7.99,
        currency: '$',
        rating: 4.9,
        deliveryDays: 2,
        deliveryDateFormatted: 'In 2 days',
        isLowestPrice: true,
        isFastestDelivery: false,
        isArrivingSoon: true,
        productUrl: 'https://www.chewy.com/s?query=Rep-Cal+Calcium+with+Vitamin+D3',
        inStock: true
      },
      {
        storeName: 'Amazon',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        price: 9.49,
        currency: '$',
        rating: 4.8,
        deliveryDays: 1,
        deliveryDateFormatted: 'Tomorrow by 11 AM',
        isLowestPrice: false,
        isFastestDelivery: true,
        isArrivingSoon: true,
        productUrl: 'https://www.amazon.com/s?k=Rep-Cal+Calcium+with+Vitamin+D3+powder',
        inStock: true
      },
      {
        storeName: 'Petco',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Petco_logo.svg',
        price: 10.29,
        currency: '$',
        rating: 4.8,
        deliveryDays: 3,
        deliveryDateFormatted: 'In 3 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: false,
        productUrl: 'https://www.petco.com/shop/en/petcostore/search?query=Rep-Cal+Calcium+D3',
        inStock: true
      },
      {
        storeName: 'Flipkart',
        storeLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg',
        price: 11.00,
        currency: '$',
        rating: 4.6,
        deliveryDays: 4,
        deliveryDateFormatted: 'In 4 days',
        isLowestPrice: false,
        isFastestDelivery: false,
        isArrivingSoon: false,
        productUrl: 'https://www.flipkart.com/search?q=Rep-Cal+Calcium+with+D3',
        inStock: true
      }
    ]
  }
];
