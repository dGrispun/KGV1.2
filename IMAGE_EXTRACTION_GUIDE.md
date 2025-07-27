# Item Image Extraction Guide

Based on your screenshot, here are the items I can identify and their corresponding filenames:

## Row 1 (Top Row)
- Gold coins → `gold_coins.png`
- Diamonds → `diamonds.png`
- Tier 8 Magic Book → `magic_book_tier8.png`
- Tier 7 Magic Book → `magic_book_tier7.png`
- Tier 6 Magic Book → `magic_book_tier6.png`
- Tier 5 Magic Book → `magic_book_tier5.png`
- Tier 4 Magic Book → `magic_book_tier4.png`
- Tier 3 Magic Book → `magic_book_tier3.png`
- Tier 2 Magic Book → `magic_book_tier2.png`
- Tier 1 Magic Book → `magic_book_tier1.png`

## Row 2
- T9 Forge Blueprint → `t9_forge_blueprint.png`
- King Forge Blueprint → `king_forge_blueprint.png`
- Luxurious Blueprint → `luxurious_blueprint.png`
- Peacock Plume Forge Blueprint → `peacock_plume_forge_blueprint.png`
- Legendary Forge Blueprint → `legendary_forge_blueprint.png`
- Epic Forge Blueprint → `epic_forge_blueprint.png`
- Perfect Forge Blueprint → `perfect_forge_blueprint.png`
- Excellent Forge Blueprint → `excellent_forge_blueprint.png`

## Row 3 (Magic Dust)
- Tier 9 Magic Dust → `tier_9_magic_dust.png`
- Tier 8 Magic Dust → `tier_8_magic_dust.png`
- Tier 7 Magic Dust → `tier_7_magic_dust.png`
- Tier 6 Magic Dust → `tier_6_magic_dust.png`
- Tier 5 Magic Dust → `tier_5_magic_dust.png`
- Tier 4 Magic Dust → `tier_4_magic_dust.png`
- Tier 3 Magic Dust → `tier_3_magic_dust.png`

## Row 4 (Armor Blueprints)
- Blueprint: Gilded Armor → `blueprint_gilded_armor.png`
- Blueprint: Dark Armor → `blueprint_dark_armor.png`
- Blueprint: Balrog Armor → `blueprint_balrog_armor.png`
- Blueprint: Legendary Armor → `blueprint_legendary_armor.png`
- Blueprint: Immortal Armor → `blueprint_immortal_armor.png`
- Blueprint: Demonic Armor → `blueprint_demonic_armor.png`
- Blueprint: Cerulean Armor → `blueprint_cerulean_armor.png`

## Column 2 (Spells & Potions)
- Perfect Summoning Spell → `perfect_summoning_spell.png`
- Advanced Summoning Spell → `advanced_summoning_spell.png`
- Blood of Titan → `blood_of_titan.png`
- Elemental Vial → `elemental_vial.png`
- Fortune Potion → `fortune_potion.png`
- Strengthening Potion → `strengthening_potion.png`
- Deluxe Dragon Soul Stone → `deluxe_dragon_soul_stone.png`
- Dragon Soul Stone → `dragon_soul_stone.png`
- Stone → `stone.png`
- Forge Hammer → `forge_hammer.png`
- Wood → `wood.png`
- Steel → `steel.png`
- Gold (various denominations) → `gold_10m.png`, `gold_1m.png`, etc.

## Column 3 (EXP Books)
- Tier 4 Archer EXP Book → `tier_4_archer_exp_book.png`
- Tier 3 Archer EXP Book → `tier_3_archer_exp_book.png`
- Tier 2 Archer EXP Book → `tier_2_archer_exp_book.png`
- Tier 1 Archer EXP Book → `tier_1_archer_exp_book.png`
- Tier 4 Flame Mage EXP Book → `tier_4_flame_mage_exp_book.png`
- Tier 3 Flame Mage EXP Book → `tier_3_flame_mage_exp_book.png`
- Tier 2 Flame Mage EXP Book → `tier_2_flame_mage_exp_book.png`
- Tier 1 Flame Mage EXP Book → `tier_1_flame_mage_exp_book.png`
- Tier 4 Ice Wizard EXP Book → `tier_4_ice_wizard_exp_book.png`
- Tier 3 Ice Wizard EXP Book → `tier_3_ice_wizard_exp_book.png`
- Tier 2 Ice Wizard EXP Book → `tier_2_ice_wizard_exp_book.png`
- Tier 1 Ice Wizard EXP Book → `tier_1_ice_wizard_exp_book.png`

## Column 4 (Dragon Runes & Special Items)
- Free-Pick Dragon Rune → `freepick_dragon_rune.png`
- Epic Dragon Rune → `epic_dragon_rune.png`
- Perfect Dragon Rune → `perfect_dragon_rune.png`
- Excellent Dragon Rune → `excellent_dragon_rune.png`
- Rare Dragon Rune → `rare_dragon_rune.png`
- Free-Pick Heroes → `freepick_hero.png`
- Master Talent Book → `master_talent_book.png`
- Crown of the Oracle → `crown_of_the_oracle.png`
- Skill Shard → `skill_shard.png`
- Gallery Shard → `gallery_shard.png`
- Free-Pick Unit EXP Book → `freepick_unit_exp_book.png`
- Light Reagent → `light_reagent.png`
- Custom Construction Item → `custom_construction_item.png`

## Action Points Column
- 200 Action Points → `200_action_points.png`
- 100 Action Points → `100_action_points.png`
- 50 Action Points → `50_action_points.png`
- 20 Action Points → `20_action_points.png`
- 10 Action Points → `10_action_points.png`
- 5 Action Points → `5_action_points.png`

## Hero Cards
- N Hero Card → `n_hero_card.png`
- R Hero Card → `r_hero_card.png`
- SR Hero Card → `sr_hero_card.png`
- SSR Hero Card → `ssr_hero_card.png`

## EXP Books (Goblin)
- Tier 4 Goblin EXP Book → `tier_4_goblin_exp_book.png`
- Tier 3 Goblin EXP Book → `tier_3_goblin_exp_book.png`
- Tier 2 Goblin EXP Book → `tier_2_goblin_exp_book.png`
- Tier 1 Goblin EXP Book → `tier_1_goblin_exp_book.png`

## Instructions for Image Extraction:
1. Open your screenshot in an image editor (like Photoshop, GIMP, or Paint.NET)
2. Crop each item to approximately 64x64 pixels
3. Save as PNG format with transparency if possible
4. Name the files exactly as specified above
5. Place all images in: `c:\KingdomGuard\public\images\items\`

## Batch Processing Tip:
If you have many images to process, you can:
1. Extract all items as separate images first
2. Use batch processing tools to resize them all to 64x64
3. Ensure they maintain their transparency/background

The updated bag page will automatically load these images and fall back to the default icon if an image is missing.
