export interface PetAvatarPreset {
  id: string;
  name: string;
  category: string;
  url: string;
  emoji: string;
}

export const PET_AVATAR_PRESETS: PetAvatarPreset[] = [
  {
    id: 'cat-ginger',
    name: 'Ginger Cat',
    category: 'mammal',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    emoji: '🐱'
  },
  {
    id: 'cat-white',
    name: 'Fluffy Cat',
    category: 'mammal',
    url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80',
    emoji: '😻'
  },
  {
    id: 'cat-tabby',
    name: 'Playful Tabby',
    category: 'mammal',
    url: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=800&q=80',
    emoji: '😸'
  },
  {
    id: 'cat-black',
    name: 'Black Cat',
    category: 'mammal',
    url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
    emoji: '🐈‍⬛'
  },
  {
    id: 'dog-golden',
    name: 'Golden Retriever',
    category: 'mammal',
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    emoji: '🐕'
  },
  {
    id: 'dog-frenchie',
    name: 'Bulldog / Frenchie',
    category: 'mammal',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    emoji: '🐶'
  },
  {
    id: 'dog-puppy',
    name: 'Cute Puppy',
    category: 'mammal',
    url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    emoji: '🐾'
  },
  {
    id: 'rabbit-fluffy',
    name: 'Fluffy Bunny',
    category: 'mammal',
    url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80',
    emoji: '🐰'
  },
  {
    id: 'hamster-cute',
    name: 'Hamster / Guinea Pig',
    category: 'mammal',
    url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=800&q=80',
    emoji: '🐹'
  },
  {
    id: 'bird-parrot',
    name: 'Parrot / Budgie',
    category: 'bird',
    url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
    emoji: '🦜'
  },
  {
    id: 'bird-cockatiel',
    name: 'Cockatiel / Songbird',
    category: 'bird',
    url: 'https://images.unsplash.com/photo-1522858547550-3405742f16f0?auto=format&fit=crop&w=800&q=80',
    emoji: '🪶'
  },
  {
    id: 'aquatic-betta',
    name: 'Betta / Tropical Fish',
    category: 'aquatic',
    url: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
    emoji: '🫧'
  },
  {
    id: 'aquatic-aquarium',
    name: 'Aquarium Fish',
    category: 'aquatic',
    url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
    emoji: '🐠'
  },
  {
    id: 'reptile-gecko',
    name: 'Gecko / Lizard',
    category: 'reptile',
    url: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=800&q=80',
    emoji: '🦎'
  },
  {
    id: 'reptile-turtle',
    name: 'Turtle / Tortoise',
    category: 'reptile',
    url: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80',
    emoji: '🐢'
  },
  {
    id: 'amphibian-frog',
    name: 'Tree Frog / Axolotl',
    category: 'amphibian',
    url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    emoji: '🐸'
  }
];

/**
 * Intelligently returns the most accurate stock photo URL based on free-text species, breed, and category.
 */
export function getSmartPetPhoto(speciesText: string, breedText: string = '', category: string = 'mammal'): string {
  const query = `${speciesText} ${breedText}`.toLowerCase().trim();

  // Cat detection
  if (
    query.includes('cat') ||
    query.includes('kitten') ||
    query.includes('kitty') ||
    query.includes('feline') ||
    query.includes('meow') ||
    query.includes('persian') ||
    query.includes('siamese') ||
    query.includes('tabby') ||
    query.includes('shorthair') ||
    query.includes('ragdoll') ||
    query.includes('maine coon') ||
    query.includes('bengal') ||
    query.includes('sphynx') ||
    query.includes('calico')
  ) {
    return 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80';
  }

  // Rabbit / Bunny detection
  if (query.includes('rabbit') || query.includes('bunny') || query.includes('hare')) {
    return 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80';
  }

  // Hamster / Guinea pig / Rodent
  if (
    query.includes('hamster') ||
    query.includes('guinea pig') ||
    query.includes('gerbil') ||
    query.includes('mouse') ||
    query.includes('rat') ||
    query.includes('chinchilla') ||
    query.includes('ferret') ||
    query.includes('hedgehog')
  ) {
    return 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=800&q=80';
  }

  // Bird detection
  if (
    category === 'bird' ||
    query.includes('bird') ||
    query.includes('parrot') ||
    query.includes('canary') ||
    query.includes('budgie') ||
    query.includes('cockatiel') ||
    query.includes('macaw') ||
    query.includes('finch') ||
    query.includes('cockatoo') ||
    query.includes('lovebird')
  ) {
    return 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80';
  }

  // Aquatic / Fish
  if (
    category === 'aquatic' ||
    query.includes('fish') ||
    query.includes('betta') ||
    query.includes('goldfish') ||
    query.includes('guppy') ||
    query.includes('tetra') ||
    query.includes('cichlid') ||
    query.includes('aquarium')
  ) {
    return 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80';
  }

  // Reptile
  if (
    category === 'reptile' ||
    query.includes('gecko') ||
    query.includes('dragon') ||
    query.includes('snake') ||
    query.includes('chameleon') ||
    query.includes('iguana') ||
    query.includes('lizard') ||
    query.includes('turtle') ||
    query.includes('tortoise') ||
    query.includes('python')
  ) {
    return 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=800&q=80';
  }

  // Amphibian
  if (
    category === 'amphibian' ||
    query.includes('frog') ||
    query.includes('axolotl') ||
    query.includes('toad') ||
    query.includes('salamander') ||
    query.includes('newt')
  ) {
    return 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80';
  }

  // Dog detection (or default mammal)
  return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80';
}
