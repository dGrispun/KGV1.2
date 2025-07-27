const fs = require('fs')
const path = require('path')

// Predefined bag items (copied from types for standalone script)
const PREDEFINED_BAG_ITEMS = [
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
]

// Item image overrides (copied from lib for standalone script)
const ITEM_IMAGE_OVERRIDES = {
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
  
  'Tier 8 Magic Book': 'magic_book_tier8',
  'Tier 7 Magic Book': 'magic_book_tier7',
  'Tier 6 Magic Book': 'magic_book_tier6',
  'Tier 5 Magic Book': 'magic_book_tier5',
  'Tier 4 Magic Book': 'magic_book_tier4',
  'Tier 3 Magic Book': 'magic_book_tier3',
  'Tier 2 Magic Book': 'magic_book_tier2',
  'Tier 1 Magic Book': 'magic_book_tier1',
  
  'Crown of the Oractle': 'crown_of_the_oracle',
  'Strenghening Potion': 'strengthening_potion',
}

function getItemImageName(itemName) {
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

const imagesDir = path.join(process.cwd(), 'public', 'images', 'items')
const missingImages = []
const foundImages = []

console.log('🔍 Checking for item images...\n')

PREDEFINED_BAG_ITEMS.forEach((itemName) => {
  const imageName = getItemImageName(itemName)
  const pngPath = path.join(imagesDir, `${imageName}.png`)
  const svgPath = path.join(imagesDir, `${imageName}.svg`)
  
  if (fs.existsSync(pngPath)) {
    foundImages.push(`✅ ${itemName} → ${imageName}.png`)
  } else if (fs.existsSync(svgPath)) {
    foundImages.push(`✅ ${itemName} → ${imageName}.svg`)
  } else {
    missingImages.push(`❌ ${itemName} → ${imageName}.png`)
  }
})

console.log(`📊 Summary:`)
console.log(`   Found: ${foundImages.length} images`)
console.log(`   Missing: ${missingImages.length} images`)
console.log(`   Total: ${PREDEFINED_BAG_ITEMS.length} items\n`)

if (foundImages.length > 0) {
  console.log('✅ Found Images:')
  foundImages.forEach(item => console.log(`   ${item}`))
  console.log('')
}

if (missingImages.length > 0) {
  console.log('❌ Missing Images:')
  missingImages.forEach(item => console.log(`   ${item}`))
  console.log('')
  console.log('💡 Tip: Add these images to public/images/items/ to see them in the bag page')
} else {
  console.log('🎉 All item images found!')
}

console.log('\n📁 Place images in: public/images/items/')
console.log('📏 Recommended size: 64x64 pixels')
console.log('🖼️  Format: PNG with transparency')
