'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Calculator, Settings } from 'lucide-react'
import { BagItem, MKPoint, MK_DAYS } from '@/types'

// Season data mapping - points per unit for each item in each season
const SEASON_DATA: { [itemName: string]: number[] } = {
  'Tier 1 Magic Book': [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800],
  'Tier 2 Magic Book': [4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000],
  'Tier 3 Magic Book': [20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000],
  'Tier 4 Magic Book': [100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000],
  'Crown of the Oractle': [7000, 7000, 3500, 3500, 1400, 1400, 1400, 700, 700, 280, 280, 280, 140, 140, 280, 280, 280, 280, 140, 140, 280, 280, 280, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 280, 280, 280, 280, 140, 140, 280, 280, 280, 280, 280, 280, 280],
  'Master Talent Book': [700, 700, 350, 350, 140, 140, 140, 70, 70, 140, 140, 140, 70, 70, 140, 140, 140, 140, 70, 70, 140, 140, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 140, 140, 140, 70, 70, 140, 140, 140, 140, 140, 140, 140, 140],
  'Rare Dragon Rune': [70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70],
  'Excellent Dragon Rune': [700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700],
  'Perfect Dragon Rune': [7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000],
  'Epic Dragon Rune': [14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000],
  'Light Reagent': [70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70],
  'Forge Hammer': [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  'Advanced Summoning Spell': [700, 700, 700, 700, 700, 700, 700, 350, 140, 140, 140, 70, 70, 140, 140, 140, 140, 140, 70, 70, 140, 140, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 140, 140, 70, 70, 140, 140, 140, 140, 70, 70, 70, 140],
  'Perfect Summoning Spell': [7000, 7000, 7000, 7000, 7000, 7000, 7000, 3500, 1400, 1400, 1400, 700, 700, 280, 280, 280, 280, 280, 140, 140, 280, 280, 280, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 280, 280, 280, 140, 140, 280, 280, 280, 280, 140, 140, 140, 280],
  'Strenghening Potion': [350, 350, 350, 350, 350, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70],
  'Fortune Potion': [3500, 3500, 3500, 3500, 3500, 1750, 700, 700, 700, 350, 350, 140, 140, 140, 140, 70, 70, 70, 140, 140, 140, 70, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 70, 70, 140, 140, 140, 140, 70, 70, 140, 140, 140, 140],
  'Elemental Vial': [700, 700, 700, 700, 700, 700, 350, 140, 140, 140, 70, 70, 140, 140, 140, 140, 70, 70, 140, 140, 140, 140, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 140, 70, 70, 140, 140, 140, 140, 70, 70, 70, 70, 140],
  'Blood of Titan': [7000, 7000, 7000, 7000, 7000, 7000, 3500, 1400, 1400, 1400, 700, 700, 280, 280, 280, 280, 140, 140, 280, 280, 280, 280, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 280, 280, 140, 140, 280, 280, 280, 280, 140, 140, 140, 140, 280],
  'Dragon Soul Stone': [700, 700, 700, 350, 350, 140, 140, 140, 70, 70, 70, 140, 140, 70, 70, 140, 140, 140, 140, 140, 70, 140, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 140, 140, 140, 140, 70, 70, 140, 140, 140, 140, 140, 70],
  'Deluxe Dragon Soul Stone': [7000, 7000, 7000, 3500, 3500, 1400, 1400, 1400, 700, 700, 700, 280, 280, 140, 140, 280, 280, 280, 280, 280, 140, 280, 280, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 280, 280, 280, 280, 140, 140, 280, 280, 280, 280, 280, 140],
  'N Hero Card': [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  'R Hero Card': [700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700],
  'SR Hero Card': [3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500],
  'SSR Hero Card': [14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000],
  'Monster defeated': [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500],
  'Rally on Titan': [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
  'Rally on Evil Guard': [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
  'Dark Priest defeated': [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500],
  'Gallery Shard': [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]
}

// Season quantities mapping - how many units needed for the points (multiplier)
const SEASON_QUANTITIES: { [itemName: string]: number[] } = {
  'Tier 1 Magic Book': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Tier 2 Magic Book': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Tier 3 Magic Book': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Tier 4 Magic Book': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Crown of the Oractle': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Master Talent Book': [1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 25, 25, 25, 25, 25, 25, 125, 125, 125, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3125, 3125, 3125, 3125, 3125, 3125, 15625, 15625, 15625, 15625, 15625, 15625, 78125, 78125],
  'Rare Dragon Rune': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Excellent Dragon Rune': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Perfect Dragon Rune': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Epic Dragon Rune': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Light Reagent': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Forge Hammer': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Advanced Summoning Spell': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 25, 25, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 125, 125, 125, 125, 125, 625, 625, 625, 625, 625, 625, 625, 3125],
  'Perfect Summoning Spell': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 25, 25, 25, 25, 125, 125, 125, 125, 125, 125, 125, 625],
  'Strenghening Potion': [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 5, 5, 5, 5, 10, 10, 10, 25, 25, 25, 50, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 625, 1250, 1250, 3125, 3125, 3125, 3125, 6250, 6250, 15625, 15625, 15625, 15625, 31250],
  'Fortune Potion': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 125, 125, 125, 625, 625, 625, 625, 625, 625, 3125, 3125, 3125, 3125, 3125],
  'Elemental Vial': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Blood of Titan': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Dragon Soul Stone': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Deluxe Dragon Soul Stone': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'N Hero Card': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'R Hero Card': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'SR Hero Card': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'SSR Hero Card': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Monster defeated': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Rally on Titan': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Rally on Evil Guard': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Dark Priest defeated': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  'Gallery Shard': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
}

// Available seasons (excluding 24-33 which have no data)
const AVAILABLE_SEASONS = [
  ...Array.from({ length: 23 }, (_, i) => i + 1),
  ...Array.from({ length: 13 }, (_, i) => i + 34)
]

interface MKItemData {
  name: string
  pointsPerUnit: number
  quantity: number
  isAction: boolean
  total: number
}

interface DayData {
  day: string
  items: MKItemData[]
  total: number
}

interface SharedItemData {
  name: string
  pointsPerUnit: number
  quantity: number
  isAction: boolean
  total: number
}

interface ActionQuantities {
  [day: string]: {
    [itemName: string]: number
  }
}

export default function MKPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [bagItems, setBagItems] = useState<Map<string, number>>(new Map())
  const [mkPoints, setMKPoints] = useState<Map<string, number>>(new Map())
  const [actionQuantities, setActionQuantities] = useState<ActionQuantities>({})
  const [dayData, setDayData] = useState<DayData[]>([])
  const [sharedItems, setSharedItems] = useState<SharedItemData[]>([])
  const [grandTotal, setGrandTotal] = useState(0)
  const [newItemName, setNewItemName] = useState('')
  const [newItemPoints, setNewItemPoints] = useState(0)
  const [selectedDay, setSelectedDay] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const supabase = createClient()

  // Get points per unit for an item based on selected season
  const getSeasonPoints = (itemName: string): number => {
    const seasonData = SEASON_DATA[itemName]
    if (!seasonData) return 0
    
    const seasonIndex = selectedSeason - 1
    if (seasonIndex < 0 || seasonIndex >= seasonData.length) return 0
    
    return seasonData[seasonIndex]
  }

  // Get required quantity (multiplier) for an item based on selected season
  const getSeasonQuantity = (itemName: string): number => {
    const quantityData = SEASON_QUANTITIES[itemName]
    if (!quantityData) return 1
    
    const seasonIndex = selectedSeason - 1
    if (seasonIndex < 0 || seasonIndex >= quantityData.length) return 1
    
    return quantityData[seasonIndex] || 1
  }

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  useEffect(() => {
    calculateTotals()
  }, [bagItems, mkPoints, actionQuantities, selectedSeason]) // Add selectedSeason dependency

  const loadData = async () => {
    try {
      // Load bag items
      const { data: bagData, error: bagError } = await supabase
        .from('bag_items')
        .select('*')
        .eq('user_id', user!.id)

      if (bagError) throw bagError

      const bagMap = new Map<string, number>()
      bagData.forEach((item: BagItem) => {
        bagMap.set(item.item_name, item.quantity)
      })
      setBagItems(bagMap)

      // Load MK points
      const { data: mkData, error: mkError } = await supabase
        .from('mk_points')
        .select('*')
        .eq('user_id', user!.id)

      if (mkError) throw mkError

      const mkMap = new Map<string, number>()
      mkData.forEach((item: MKPoint) => {
        const key = `${item.day}:${item.item_name}`
        mkMap.set(key, item.points_per_unit)
      })
      setMKPoints(mkMap)

    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotals = () => {
    // All items are now shared - collect all unique items from all days
    const sharedItemNames = [
      // Day I items
      'Tier 1 Magic Book', 'Tier 2 Magic Book', 'Tier 3 Magic Book', 'Tier 4 Magic Book',
      'Crown of the Oractle', 'Master Talent Book',
      // Day II items
      'Rare Dragon Rune', 'Excellent Dragon Rune', 'Perfect Dragon Rune', 'Epic Dragon Rune',
      'Light Reagent', 'Forge Hammer', 'Advanced Summoning Spell', 'Perfect Summoning Spell',
      // Day III items
      'Dragon Soul Stone', 'Deluxe Dragon Soul Stone',
      // Day IV items
      'Strenghening Potion', 'Fortune Potion',
      // Day V items
      'Elemental Vial', 'Blood of Titan',
      // Day VI items
      'N Hero Card', 'R Hero Card', 'SR Hero Card', 'SSR Hero Card',
      // Action items (appear in all days)
      'Monster defeated', 'Rally on Titan', 'Rally on Evil Guard', 'Dark Priest defeated', 'Gallery Shard'
    ]
    
    // Calculate shared items (only count once for grand total)
    const newSharedItems: SharedItemData[] = sharedItemNames.map(itemName => {
      // Use season-based points or custom user-set points
      const pointsKey = `${selectedSeason}:${itemName}`
      const customPoints = mkPoints.get(pointsKey)
      const seasonPoints = getSeasonPoints(itemName)
      const pointsPerUnit = customPoints ?? seasonPoints
      
      let quantity = 0
      if (itemName === 'Monster defeated' || itemName === 'Rally on Titan' || itemName === 'Rally on Evil Guard' || itemName === 'Dark Priest defeated') {
        // For action items, sum across all days
        quantity = Object.values(actionQuantities).reduce((sum, dayActions) => {
          return sum + (dayActions[itemName] ?? 0)
        }, 0)
      } else {
        // Special case: For SSR Hero Card, combine with Free-Pick Hero quantities
        if (itemName === 'SSR Hero Card') {
          const ssrQuantity = bagItems.get('SSR Hero Card') ?? 0
          const freePickQuantity = bagItems.get('Free-Pick Hero') ?? 0
          quantity = ssrQuantity + freePickQuantity
        } else {
          quantity = bagItems.get(itemName) ?? 0
        }
      }

      // Get the required quantity (multiplier) for this season
      const requiredQuantity = getSeasonQuantity(itemName)
      // Calculate effective quantity (how many times we can get the points)
      const effectiveQuantity = Math.floor(quantity / requiredQuantity)
      const total = effectiveQuantity * pointsPerUnit

      return {
        name: itemName,
        pointsPerUnit,
        quantity,
        isAction: ['Monster defeated', 'Rally on Titan', 'Rally on Evil Guard', 'Dark Priest defeated'].includes(itemName),
        total
      }
    })

    setSharedItems(newSharedItems)

    // Calculate day-specific items (now empty since all items are shared)
    const newDayData: DayData[] = MK_DAYS.map(day => {
      // All items are now in shared section, so day items are empty
      const items: MKItemData[] = []
      const dayTotal = 0

      return {
        day: day.day,
        items,
        total: dayTotal
      }
    })

    setDayData(newDayData)
    
    // Grand total = only shared items total (no day-specific items)
    const sharedTotal = newSharedItems.reduce((sum, item) => sum + item.total, 0)
    const newGrandTotal = sharedTotal
    setGrandTotal(newGrandTotal)
  }

  const updatePointsPerUnit = (itemName: string, points: number) => {
    // Use season-based key for storing custom points
    const key = `${selectedSeason}:${itemName}`
    const newMKPoints = new Map(mkPoints)
    newMKPoints.set(key, points)
    setMKPoints(newMKPoints)
  }

  const updateActionQuantity = (day: string, itemName: string, quantity: number) => {
    setActionQuantities(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [itemName]: quantity
      }
    }))
  }

  const updateSharedActionQuantity = (itemName: string, quantity: number) => {
    // Update the quantity for shared action items across all days
    const newActionQuantities = { ...actionQuantities }
    MK_DAYS.forEach(day => {
      if (!newActionQuantities[day.day]) {
        newActionQuantities[day.day] = {}
      }
      newActionQuantities[day.day][itemName] = quantity
    })
    setActionQuantities(newActionQuantities)
  }

  const saveMKPoints = async () => {
    if (!user) return

    setSaving(true)
    try {
      const upsertData: any[] = []
      
      // Save custom points per unit
      mkPoints.forEach((pointsPerUnit, key) => {
        const [day, itemName] = key.split(':')
        upsertData.push({
          user_id: user.id,
          day,
          item_name: itemName,
          points_per_unit: pointsPerUnit
        })
      })

      if (upsertData.length > 0) {
        const { error } = await supabase
          .from('mk_points')
          .upsert(upsertData, { 
            onConflict: 'user_id,day,item_name',
            ignoreDuplicates: false 
          })

        if (error) throw error
      }

      toast.success('MK points saved successfully!')
    } catch (error) {
      console.error('Error saving MK points:', error)
      toast.error('Failed to save MK points')
    } finally {
      setSaving(false)
    }
  }

  const addCustomItem = async () => {
    if (!newItemName.trim() || !selectedDay) {
      toast.error('Please fill in all fields')
      return
    }

    const key = `${selectedDay}:${newItemName}`
    if (mkPoints.has(key)) {
      toast.error('Item already exists for this day')
      return
    }

    const newMKPoints = new Map(mkPoints)
    newMKPoints.set(key, newItemPoints)
    setMKPoints(newMKPoints)

    setNewItemName('')
    setNewItemPoints(0)
    setSelectedDay('')
    setIsDialogOpen(false)
    toast.success('Custom item added successfully!')
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute saveFunction={saveMKPoints} saving={saving}>
      <div className="ml-64 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-3 py-4 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">MK Event Calculator</h1>
          </div>

          <Card className="p-4 mb-4 bg-slate-800/30 backdrop-blur-sm border-slate-600/50">
            <div className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-blue-400" />
              <span className="text-lg font-semibold text-white">Grand Total:</span>
              <span className="text-2xl font-bold text-yellow-300">{grandTotal.toLocaleString()} points</span>
            </div>
          </Card>

          {/* Shared Items Section */}
          <Card className="p-4 mb-4 bg-slate-800/40 backdrop-blur-sm border-amber-600/50">
            <div className="mb-3 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-amber-300">Shared Items (Counted Once)</h2>
                <p className="text-sm text-slate-300">These items appear in all days but are only counted once for the grand total</p>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-400" />
                <Label className="text-white font-medium">Season:</Label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                  className="bg-slate-800/80 border border-slate-600 rounded-md px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                >
                  {AVAILABLE_SEASONS.map(season => (
                    <option key={season} value={season}>Season {season}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {sharedItems.map((item) => (
                <div key={`shared-${item.name}`} className="bg-gradient-to-b from-amber-700/20 to-amber-800/20 border border-amber-600/50 rounded-lg p-2 hover:border-amber-400 transition-all duration-200 shadow-lg">
                  <div className="space-y-2">
                    <h4 className="font-medium text-xs text-amber-200 truncate" title={item.name}>{item.name}</h4>
                    
                    <div className="grid grid-cols-2 gap-1">
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-300">Points/Unit</Label>
                        <Input
                          type="number"
                          min="0"
                          value={item.pointsPerUnit}
                          onChange={(e) => updatePointsPerUnit(item.name, parseInt(e.target.value) || 0)}
                          className="h-7 text-xs text-center bg-slate-900/50 border-slate-600 text-white focus:border-amber-400"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-300">
                          {item.isAction ? 'Total Count' : 'From Bag'}
                        </Label>
                        {item.isAction ? (
                          <Input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => updateSharedActionQuantity(item.name, parseInt(e.target.value) || 0)}
                            className="h-7 text-xs text-center bg-slate-900/50 border-slate-600 text-white focus:border-amber-400"
                            title="Total count across all days"
                          />
                        ) : (
                          <Input
                            type="number"
                            value={item.quantity}
                            disabled
                            className="h-7 text-xs text-center bg-slate-900/30 border-slate-700 text-slate-400"
                            title="Quantity from your bag"
                          />
                        )}
                      </div>
                    </div>
                    
                    {(() => {
                      const requiredQuantity = getSeasonQuantity(item.name)
                      return requiredQuantity > 1 ? (
                        <div className="text-xs text-blue-300 text-center">
                          Requires {requiredQuantity} units
                        </div>
                      ) : null
                    })()}

                    <div className="pt-1 border-t border-amber-600/30">
                      <div className="text-center">
                        <span className="text-xs font-semibold text-amber-300">
                          {item.total.toLocaleString()} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Tabs defaultValue="I" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border-slate-600">
              {MK_DAYS.map((day) => (
                <TabsTrigger 
                  key={day.day} 
                  value={day.day} 
                  className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300 text-slate-300 hover:text-white"
                >
                  {day.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {dayData.map((day) => (
              <TabsContent key={day.day} value={day.day} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Day {day.day}</h2>
                  <div className="text-lg font-semibold text-yellow-300">
                    All items moved to Shared Items section
                  </div>
                </div>

                <div className="text-center text-slate-400 py-8">
                  <p className="text-lg">All items for Day {day.day} are now in the "Shared Items (Counted Once)" section above.</p>
                  <p className="text-sm mt-2">This prevents duplicate counting and gives you the accurate total points.</p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
