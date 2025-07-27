// Item image mapping utility
export const getItemImagePath = (itemName: string): string => {
  // Convert item name to a safe filename
  const safeFileName = itemName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores

  return `/images/items/${safeFileName}.png`
}

// Fallback image for items without specific images
export const getItemFallbackImage = (): string => {
  return `/images/items/default_item.png`
}

// Check if item has a custom image
export const hasItemImage = (_itemName: string): boolean => {
  // For now, we'll assume all items have images
  // This can be expanded to check actual file existence
  return true
}

// Item name to image filename mappings for special cases
export const ITEM_IMAGE_OVERRIDES: { [key: string]: string } = {
  // Currency
  'Gold': 'gold_coins',
  'Diamonds': 'diamonds',
  '10M Gold': 'gold_10m',
  '1M Gold': 'gold_1m',
  '500K Gold': 'gold_500k',
  '100K Gold': 'gold_100k',
  '50k Gold': 'gold_50k',
  '10k Gold': 'gold_10k',
  '5k Gold': 'gold_5k',
  '1k Gold': 'gold_1k',
  
  // Magic Books
  'Tier 8 Magic Book': 'magic_book_tier8',
  'Tier 7 Magic Book': 'magic_book_tier7',
  'Tier 6 Magic Book': 'magic_book_tier6',
  'Tier 5 Magic Book': 'magic_book_tier5',
  'Tier 4 Magic Book': 'magic_book_tier4',
  'Tier 3 Magic Book': 'magic_book_tier3',
  'Tier 2 Magic Book': 'magic_book_tier2',
  'Tier 1 Magic Book': 'magic_book_tier1',
  
  // Blueprints
  'T9 Forge Blueprint': 't9_forge_blueprint',
  'King Forge Blueprint': 'king_forge_blueprint',
  'Luxurious Blueprint': 'luxurious_blueprint',
  'Peacock Plume Forge Blueprint': 'peacock_plume_forge_blueprint',
  'Legendary Forge Blueprint': 'legendary_forge_blueprint',
  'Epic Forge Blueprint': 'epic_forge_blueprint',
  'Perfect Forge Blueprint': 'perfect_forge_blueprint',
  'Excellent Forge Blueprint': 'excellent_forge_blueprint',
  
  // Magic Dust
  'Tier 9 Magic Dust': 'magic_dust_tier9',
  'Tier 8 Magic Dust': 'magic_dust_tier8',
  'Tier 7 Magic Dust': 'magic_dust_tier7',
  'Tier 6 Magic Dust': 'magic_dust_tier6',
  'Tier 5 Magic Dust': 'magic_dust_tier5',
  'Tier 4 Magic Dust': 'magic_dust_tier4',
  'Tier 3 Magic Dust': 'magic_dust_tier3',
  
  // Armor Blueprints
  'Blueprint: Gilded Armor': 'blueprint_gilded_armor',
  'Blueprint: Dark Armor': 'blueprint_dark_armor',
  'Blueprint: Balrog Armor': 'blueprint_balrog_armor',
  'Blueprint: Legendary Armor': 'blueprint_legendary_armor',
  'Blueprint: Immortal Armor': 'blueprint_immortal_armor',
  'Blueprint: Demonic Armor': 'blueprint_demonic_armor',
  'Blueprint: Cerulean Armor': 'blueprint_cerulean_armor',
  
  // Spells and Potions
  'Perfect Summoning Spell': 'perfect_summoning_spell',
  'Advanced Summoning Spell': 'advanced_summoning_spell',
  'Blood of Titan': 'blood_of_titan',
  'Elemental Vial': 'elemental_vial',
  'Fortune Potion': 'fortune_potion',
  'Strenghening Potion': 'strengthening_potion',
  
  // Dragon Items
  'Deluxe Dragon Soul Stone': 'deluxe_dragon_soul_stone',
  'Dragon Soul Stone': 'dragon_soul_stone',
  'Free-Pick Dragon Rune': 'free_pick_dragon_rune',
  'Epic Dragon Rune': 'epic_dragon_rune',
  'Perfect Dragon Rune': 'perfect_dragon_rune',
  'Excellent Dragon Rune': 'excellent_dragon_rune',
  'Rare Dragon Rune': 'rare_dragon_rune',
  
  // Materials
  'Stone': 'stone',
  'Forge Hammer': 'forge_hammer',
  'Wood': 'wood',
  'Steel': 'steel',
  
  // EXP Books
  'Tier 4 Archer EXP Book': 'archer_exp_tier4',
  'Tier 3 Archer EXP Book': 'archer_exp_tier3',
  'Tier 2 Archer EXP Book': 'archer_exp_tier2',
  'Tier 1 Archer EXP Book': 'archer_exp_tier1',
  'Tier 4 Flame Mage EXP Book': 'flame_mage_exp_tier4',
  'Tier 3 Flame Mage EXP Book': 'flame_mage_exp_tier3',
  'Tier 2 Flame Mage EXP Book': 'flame_mage_exp_tier2',
  'Tier 1 Flame Mage EXP Book': 'flame_mage_exp_tier1',
  'Tier 4 Ice Wizard EXP Book': 'ice_wizard_exp_tier4',
  'Tier 3 Ice Wizard EXP Book': 'ice_wizard_exp_tier3',
  'Tier 2 Ice Wizard EXP Book': 'ice_wizard_exp_tier2',
  'Tier 1 Ice Wizard EXP Book': 'ice_wizard_exp_tier1',
  'Tier 4 Goblin EXP Book': 'goblin_exp_tier4',
  'Tier 3 Goblin EXP Book': 'goblin_exp_tier3',
  'Tier 2 Goblin EXP Book': 'goblin_exp_tier2',
  'Tier 1 Goblin EXP Book': 'goblin_exp_tier1',
  
  // Special Items
  'N Hero Card': 'n_hero_card',
  'R Hero Card': 'r_hero_card',
  'SR Hero Card': 'sr_hero_card',
  'SSR Hero Card': 'ssr_hero_card',
  'Free-Pick Hero': 'free_pick_hero',
  'Master Talent Book': 'master_talent_book',
  'Crown of the Oractle': 'crown_of_the_oracle',
  'Skill Shard': 'skill_shard',
  'Gallery Shard': 'gallery_shard',
  'Free-Pick Unit EXP Book': 'free_pick_unit_exp_book',
  'Light Reagent': 'light_reagent',
  'Custom Construction Item': 'custom_construction_item',
  
  // Action Points
  '200 Action Points': 'action_points_200',
  '100 Action Points': 'action_points_100',
  '50 Action Points': 'action_points_50',
  '20 Action Points': 'action_points_20',
  '10 Action Points': 'action_points_10',
  '5 Action Points': 'action_points_5',
}

export const getItemImageName = (itemName: string): string => {
  // Check for override first
  if (ITEM_IMAGE_OVERRIDES[itemName]) {
    return ITEM_IMAGE_OVERRIDES[itemName]
  }
  
  // Default conversion
  return itemName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}
