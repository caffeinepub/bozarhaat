// Sustainable Living Category Taxonomy - Single Source of Truth
// URL-safe IDs with English display names and descriptions

export interface SustainableLivingCategory {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export const SUSTAINABLE_LIVING_CATEGORIES: SustainableLivingCategory[] = [
  {
    id: 'food-nutrition',
    name: 'Food & Nutrition',
    description: 'Organic, local, chemical-free daily food items',
    emoji: '🌱',
  },
  {
    id: 'clothing-textiles',
    name: 'Clothing & Textiles',
    description: 'Eco-friendly, handloom, sustainable fabrics',
    emoji: '👕',
  },
  {
    id: 'shelter-home-needs',
    name: 'Shelter & Home Needs',
    description: 'Sustainable housing materials, basic home essentials',
    emoji: '🏠',
  },
  {
    id: 'water-sanitation',
    name: 'Water & Sanitation',
    description: 'Water saving tools, purification, sanitation products',
    emoji: '💧',
  },
  {
    id: 'energy-solutions',
    name: 'Energy Solutions',
    description: 'Solar products, energy-efficient appliances',
    emoji: '🔆',
  },
  {
    id: 'rural-livelihood-products',
    name: 'Rural & Livelihood Products',
    description: 'Farmer, artisan, and SHG-made products',
    emoji: '🌾',
  },
  {
    id: 'health-personal-care',
    name: 'Health & Personal Care',
    description: 'Natural, herbal, plastic-free care items',
    emoji: '🧴',
  },
  {
    id: 'daily-essentials',
    name: 'Daily Essentials',
    description: 'Reusable, biodegradable household products',
    emoji: '♻️',
  },
  {
    id: 'education-skill-tools',
    name: 'Education & Skill Tools',
    description: 'Learning kits, training materials for sustainable life',
    emoji: '📚',
  },
  {
    id: 'animal-nature-care',
    name: 'Animal & Nature Care',
    description: 'Products supporting animal welfare and biodiversity',
    emoji: '🐄',
  },
];

// Helper function to get category by ID
export function getCategoryById(id: string): SustainableLivingCategory | undefined {
  return SUSTAINABLE_LIVING_CATEGORIES.find(cat => cat.id === id);
}

// Helper function to get category name by ID
export function getCategoryName(id: string): string {
  const category = getCategoryById(id);
  return category ? category.name : id;
}
