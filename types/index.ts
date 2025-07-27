export interface User {
  id: string
  email: string
  created_at: string
}

export interface UserProfile {
  id: string
  nickname?: string
  created_at: string
  updated_at: string
}

export interface BagItem {
  id: string
  user_id: string
  item_name: string
  quantity: number
  created_at?: string
  updated_at?: string
}

export interface MKPoint {
  id: string
  user_id: string
  day: string
  item_name: string
  points_per_unit: number
  season?: number
  created_at?: string
  updated_at?: string
}

export interface MKDay {
  day: string
  label: string
  items: Array<{
    name: string
    defaultPoints: number
    isAction?: boolean
  }>
}

// Predefined bag items
export const PREDEFINED_BAG_ITEMS = [
  // Currency
  'Gold',
  'Diamonds',
  '10M Gold',
  '1M Gold',
  '500K Gold',
  '100K Gold',
  '50k Gold',
  '10k Gold',
  '5k Gold',
  '1k Gold',
  
  // Magic Books
  'Tier 8 Magic Book',
  'Tier 7 Magic Book',
  'Tier 6 Magic Book',
  'Tier 5 Magic Book',
  'Tier 4 Magic Book',
  'Tier 3 Magic Book',
  'Tier 2 Magic Book',
  'Tier 1 Magic Book',
  
  // Blueprints
  'T9 Forge Blueprint',
  'King Forge Blueprint',
  'Luxurious Blueprint',
  'Peacock Plume Forge Blueprint',
  'Legendary Forge Blueprint',
  'Epic Forge Blueprint',
  'Perfect Forge Blueprint',
  'Excellent Forge Blueprint',
  
  // Magic Dust
  'Tier 9 Magic Dust',
  'Tier 8 Magic Dust',
  'Tier 7 Magic Dust',
  'Tier 6 Magic Dust',
  'Tier 5 Magic Dust',
  'Tier 4 Magic Dust',
  'Tier 3 Magic Dust',
  
  // Armor Blueprints
  'Blueprint: Gilded Armor',
  'Blueprint: Dark Armor',
  'Blueprint: Balrog Armor',
  'Blueprint: Legendary Armor',
  'Blueprint: Immortal Armor',
  'Blueprint: Demonic Armor',
  'Blueprint: Cerulean Armor',
  
  // Spells and Potions
  'Perfect Summoning Spell',
  'Advanced Summoning Spell',
  'Blood of Titan',
  'Elemental Vial',
  'Fortune Potion',
  'Strenghening Potion',
  
  // Dragon Items
  'Deluxe Dragon Soul Stone',
  'Dragon Soul Stone',
  'Free-Pick Dragon Rune',
  'Epic Dragon Rune',
  'Perfect Dragon Rune',
  'Excellent Dragon Rune',
  'Rare Dragon Rune',
  
  // Materials
  'Stone',
  'Forge Hammer',
  'Wood',
  'Steel',
  
  // EXP Books
  'Tier 4 Archer EXP Book',
  'Tier 3 Archer EXP Book',
  'Tier 2 Archer EXP Book',
  'Tier 1 Archer EXP Book',
  'Tier 4 Flame Mage EXP Book',
  'Tier 3 Flame Mage EXP Book',
  'Tier 2 Flame Mage EXP Book',
  'Tier 1 Flame Mage EXP Book',
  'Tier 4 Ice Wizard EXP Book',
  'Tier 3 Ice Wizard EXP Book',
  'Tier 2 Ice Wizard EXP Book',
  'Tier 1 Ice Wizard EXP Book',
  'Tier 4 Goblin EXP Book',
  'Tier 3 Goblin EXP Book',
  'Tier 2 Goblin EXP Book',
  'Tier 1 Goblin EXP Book',
  
  // Special Items
  'N Hero Card',
  'R Hero Card',
  'SR Hero Card',
  'SSR Hero Card',
  'Free-Pick Hero',
  'Master Talent Book',
  'Crown of the Oractle',
  'Skill Shard',
  'Gallery Shard',
  'Free-Pick Unit EXP Book',
  'Light Reagent',
  'Custom Construction Item',
  
  // Action Points
  '200 Action Points',
  '100 Action Points',
  '50 Action Points',
  '20 Action Points',
  '10 Action Points',
  '5 Action Points',
] as const

// MK Days configuration
export const MK_DAYS: MKDay[] = [
  {
    day: 'I',
    label: 'Day I',
    items: [
      { name: 'Tier 1 Magic Book', defaultPoints: 800 },
      { name: 'Tier 2 Magic Book', defaultPoints: 4000 },
      { name: 'Tier 3 Magic Book', defaultPoints: 20000 },
      { name: 'Tier 4 Magic Book', defaultPoints: 100000 },
      { name: 'Crown of the Oractle', defaultPoints: 1400 },
      { name: 'Master Talent Book', defaultPoints: 140 },
      { name: 'Monster defeated', defaultPoints: 500, isAction: true },
      { name: 'Rally on Titan', defaultPoints: 1000, isAction: true },
      { name: 'Rally on Evil Guard', defaultPoints: 1000, isAction: true },
      { name: 'Dark Priest defeated', defaultPoints: 500, isAction: true },
      { name: 'Gallery Shard', defaultPoints: 1000 },
    ],
  },
  {
    day: 'II',
    label: 'Day II',
    items: [
      { name: 'Rare Dragon Rune', defaultPoints: 70 },
      { name: 'Excellent Dragon Rune', defaultPoints: 700 },
      { name: 'Perfect Dragon Rune', defaultPoints: 7000 },
      { name: 'Epic Dragon Rune', defaultPoints: 14000 },
      { name: 'Light Reagent', defaultPoints: 70 },
      { name: 'Forge Hammer', defaultPoints: 100 },
      { name: 'Advanced Summoning Spell', defaultPoints: 700 },
      { name: 'Perfect Summoning Spell', defaultPoints: 7000 },
      { name: 'Monster defeated', defaultPoints: 500, isAction: true },
      { name: 'Rally on Titan', defaultPoints: 1000, isAction: true },
      { name: 'Rally on Evil Guard', defaultPoints: 1000, isAction: true },
      { name: 'Dark Priest defeated', defaultPoints: 500, isAction: true },
      { name: 'Gallery Shard', defaultPoints: 1000 },
    ],
  },
  {
    day: 'III',
    label: 'Day III',
    items: [
      { name: 'Rare Dragon Rune', defaultPoints: 70 },
      { name: 'Excellent Dragon Rune', defaultPoints: 700 },
      { name: 'Perfect Dragon Rune', defaultPoints: 7000 },
      { name: 'Epic Dragon Rune', defaultPoints: 14000 },
      { name: 'Dragon Soul Stone', defaultPoints: 350 },
      { name: 'Deluxe Dragon Soul Stone', defaultPoints: 3500 },
      { name: 'Monster defeated', defaultPoints: 500, isAction: true },
      { name: 'Rally on Titan', defaultPoints: 1000, isAction: true },
      { name: 'Rally on Evil Guard', defaultPoints: 1000, isAction: true },
      { name: 'Dark Priest defeated', defaultPoints: 500, isAction: true },
      { name: 'Gallery Shard', defaultPoints: 1000 },
    ],
  },
  {
    day: 'IV',
    label: 'Day IV',
    items: [
      { name: 'Light Reagent', defaultPoints: 70 },
      { name: 'Strenghening Potion', defaultPoints: 350 },
      { name: 'Fortune Potion', defaultPoints: 3500 },
      { name: 'Monster defeated', defaultPoints: 500, isAction: true },
      { name: 'Rally on Titan', defaultPoints: 1000, isAction: true },
      { name: 'Rally on Evil Guard', defaultPoints: 1000, isAction: true },
      { name: 'Dark Priest defeated', defaultPoints: 500, isAction: true },
      { name: 'Gallery Shard', defaultPoints: 1000 },
    ],
  },
  {
    day: 'V',
    label: 'Day V',
    items: [
      { name: 'Forge Hammer', defaultPoints: 100 },
      { name: 'Elemental Vial', defaultPoints: 700 },
      { name: 'Blood of Titan', defaultPoints: 7000 },
      { name: 'Monster defeated', defaultPoints: 500, isAction: true },
      { name: 'Rally on Titan', defaultPoints: 1000, isAction: true },
      { name: 'Rally on Evil Guard', defaultPoints: 1000, isAction: true },
      { name: 'Dark Priest defeated', defaultPoints: 500, isAction: true },
      { name: 'Gallery Shard', defaultPoints: 1000 },
    ],
  },
  {
    day: 'VI',
    label: 'Day VI',
    items: [
      { name: 'N Hero Card', defaultPoints: 100 },
      { name: 'R Hero Card', defaultPoints: 700 },
      { name: 'SR Hero Card', defaultPoints: 3500 },
      { name: 'SSR Hero Card', defaultPoints: 14000 },
      { name: 'Monster defeated', defaultPoints: 500, isAction: true },
      { name: 'Rally on Titan', defaultPoints: 1000, isAction: true },
      { name: 'Rally on Evil Guard', defaultPoints: 1000, isAction: true },
      { name: 'Dark Priest defeated', defaultPoints: 500, isAction: true },
      { name: 'Gallery Shard', defaultPoints: 1000 },
    ],
  },
]
