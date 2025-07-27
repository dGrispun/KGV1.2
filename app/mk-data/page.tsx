'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Database, Search, Download } from 'lucide-react'

interface MKDataItem {
  name: string
  values: number[]
  quantities: number[]
}

const MK_SEASONS_DATA: MKDataItem[] = [
  {
    name: 'Tier 1 Unit Tome',
    values: [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'Tier 2 Unit Tome',
    values: [4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'Tier 3 Unit Tome',
    values: [20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'Tier 4 Unit Tome',
    values: [100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'Crown of the Oracle',
    values: [7000, 7000, 3500, 3500, 1400, 1400, 1400, 700, 700, 280, 280, 280, 140, 140, 280, 280, 280, 280, 140, 140, 280, 280, 280, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 280, 280, 280, 280, 140, 140, 280, 280, 280, 280, 280, 280, 280, 280],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 25, 25, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 625, 625, 625, 625, 625, 625, 3125, 3125, 3125, 3125, 3125, 3125, 15625, 15625]
  },
  {
    name: 'Master Talent Book',
    values: [700, 700, 350, 350, 140, 140, 140, 70, 70, 140, 140, 140, 70, 70, 140, 140, 140, 140, 70, 70, 140, 140, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 140, 140, 140, 70, 70, 140, 140, 140, 140, 140, 140, 140, 140],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 25, 25, 25, 25, 25, 25, 125, 125, 125, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3125, 3125, 3125, 3125, 3125, 3125, 15625, 15625, 15625, 15625, 15625, 15625, 78125, 78125]
  },
  {
    name: 'Rare Dragon Rune',
    values: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'Excellent Dragon Rune',
    values: [700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'Perfect Dragon Rune',
    values: [7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'Epic Dragon Rune',
    values: [14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'Light Reagent',
    values: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'Forge Hammer',
    values: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'Advanced Summoning Spell',
    values: [700, 700, 700, 700, 700, 700, 700, 350, 140, 140, 140, 70, 70, 140, 140, 140, 140, 140, 70, 70, 140, 140, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 140, 140, 70, 70, 140, 140, 140, 140, 70, 70, 70, 140, 140],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 25, 25, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 125, 125, 125, 125, 125, 625, 625, 625, 625, 625, 625, 625, 3125, 3125]
  },
  {
    name: 'Perfect Summoning Spell',
    values: [7000, 7000, 7000, 7000, 7000, 7000, 7000, 3500, 1400, 1400, 1400, 700, 700, 280, 280, 280, 280, 280, 140, 140, 280, 280, 280, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 280, 280, 280, 140, 140, 280, 280, 280, 280, 140, 140, 140, 280, 280],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 25, 25, 25, 25, 125, 125, 125, 125, 125, 125, 125, 625, 625]
  },
  {
    name: 'Strengthening Potion',
    values: [350, 350, 350, 350, 350, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70],
    quantities: [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 5, 5, 5, 5, 10, 10, 10, 25, 25, 25, 50, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 625, 1250, 1250, 3125, 3125, 3125, 3125, 6250, 6250, 15625, 15625, 15625, 15625, 31250]
  },
  {
    name: 'Fortune Potion',
    values: [3500, 3500, 3500, 3500, 3500, 1750, 700, 700, 700, 350, 350, 140, 140, 140, 140, 70, 70, 70, 140, 140, 140, 70, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 70, 70, 140, 140, 140, 140, 70, 70, 140, 140, 140, 140, 70],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 125, 125, 125, 625, 625, 625, 625, 625, 625, 3125, 3125, 3125, 3125, 3125]
  },
  {
    name: 'Elemental Vial',
    values: [700, 700, 700, 700, 700, 700, 350, 140, 140, 140, 70, 70, 140, 140, 140, 140, 70, 70, 140, 140, 140, 140, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 140, 70, 70, 140, 140, 140, 140, 70, 70, 70, 70, 140, 140],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 25, 25, 25, 25, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 625, 625, 625, 625, 3125, 3125, 3125, 3125, 3125, 3125, 3125, 3125, 15625, 15625]
  },
  {
    name: 'Blood of Titan',
    values: [7000, 7000, 7000, 7000, 7000, 7000, 3500, 1400, 1400, 1400, 700, 700, 280, 280, 280, 280, 140, 140, 280, 280, 280, 280, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 280, 280, 140, 140, 280, 280, 280, 280, 140, 140, 140, 140, 280, 280],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 125, 125, 125, 125, 625, 625, 625, 625, 625, 625, 625, 625, 3125, 3125]
  },
  {
    name: 'Dragon Soul Stone',
    values: [700, 700, 700, 350, 350, 140, 140, 140, 70, 70, 70, 140, 140, 70, 70, 140, 140, 140, 140, 140, 70, 140, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 140, 140, 140, 140, 70, 70, 140, 140, 140, 140, 140, 70, 140],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 25, 25, 25, 25, 25, 25, 125, 125, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 125, 625, 625, 625, 625, 625, 625, 3125, 3125, 3125, 3125, 3125, 3125, 15625]
  },
  {
    name: 'Deluxe Dragon Soul Stone',
    values: [7000, 7000, 7000, 3500, 3500, 1400, 1400, 1400, 700, 700, 700, 280, 280, 140, 140, 280, 280, 280, 280, 280, 140, 280, 280, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 280, 280, 280, 280, 140, 140, 280, 280, 280, 280, 280, 140, 280],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 25, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 125, 125, 125, 125, 125, 125, 625, 625, 625, 625, 625, 625, 3125]
  },
  {
    name: 'N Hero Card',
    values: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'R Hero Card',
    values: [700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'SR Hero Card',
    values: [3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'SSR Hero Card',
    values: [14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000, 14000],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'Monsters',
    values: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'Titan Rally',
    values: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'Evil Guard',
    values: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'Dark Priest',
    values: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: 'Gallery Shard',
    values: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
    quantities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  }
]

export default function MKDataPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSeason, setSelectedSeason] = useState(1)
  
  const filteredData = MK_SEASONS_DATA.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const generateSeasonOptions = () => {
    const seasons = []
    for (let i = 1; i <= 46; i++) {
      if (i <= 23 || i >= 34) { // Skip seasons 24-33 as they have no data
        seasons.push(i)
      }
    }
    return seasons
  }

  const downloadCSV = () => {
    let csvContent = "Item Name,Season,Points Value,Quantity\n"
    
    MK_SEASONS_DATA.forEach(item => {
      item.values.forEach((value, index) => {
        if (value > 0) { // Only include seasons with data
          const season = index + 1
          const quantity = item.quantities[index]
          csvContent += `"${item.name}",${season},${value},${quantity}\n`
        }
      })
    })

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mk-seasons-data.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <ProtectedRoute>
      <div className="ml-64 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">MK Seasons Data</h1>
            </div>
            
            <Button
              onClick={downloadCSV}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>

          {/* Search and Filter Controls */}
          <Card className="p-4 mb-6 bg-slate-800/30 backdrop-blur-sm border-slate-600/50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label className="text-white mb-2 block">Search Items</Label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute top-3 left-3 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search by item name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
              </div>
              
              <div className="sm:w-48">
                <Label className="text-white mb-2 block">View Season</Label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                  className="w-full h-10 px-3 bg-slate-900/50 border border-slate-600 rounded-md text-white focus:border-blue-400"
                >
                  {generateSeasonOptions().map(season => (
                    <option key={season} value={season}>Season {season}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border-slate-600">
              <TabsTrigger value="table" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300 text-slate-300">
                Data Table
              </TabsTrigger>
              <TabsTrigger value="season" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300 text-slate-300">
                Season View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="space-y-4">
              <Card className="bg-slate-800/20 backdrop-blur-sm border-slate-600/50">
                <div className="p-4">
                  <h2 className="text-xl font-bold text-white mb-4">Complete Seasons Data</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left text-white font-semibold p-3 sticky left-0 bg-slate-800/80 backdrop-blur-sm">Item Name</th>
                          {Array.from({ length: 46 }, (_, i) => i + 1).map(season => (
                            <th key={season} className="text-center text-white font-semibold p-2 min-w-[80px]">
                              S{season}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item, index) => (
                          <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                            <td className="text-white font-medium p-3 sticky left-0 bg-slate-800/60 backdrop-blur-sm">
                              {item.name}
                            </td>
                            {item.values.map((value, seasonIndex) => (
                              <td key={seasonIndex} className="text-center p-2">
                                {value > 0 ? (
                                  <div className="space-y-1">
                                    <div className="text-yellow-300 font-semibold">{value.toLocaleString()}</div>
                                    <div className="text-slate-400 text-xs">×{item.quantities[seasonIndex]}</div>
                                  </div>
                                ) : (
                                  <span className="text-slate-500">—</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="season" className="space-y-4">
              <Card className="bg-slate-800/20 backdrop-blur-sm border-slate-600/50">
                <div className="p-4">
                  <h2 className="text-xl font-bold text-white mb-4">Season {selectedSeason} Data</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredData.map((item, index) => {
                      const value = item.values[selectedSeason - 1]
                      const quantity = item.quantities[selectedSeason - 1]
                      
                      if (value === 0) return null
                      
                      return (
                        <div key={index} className="bg-gradient-to-b from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-lg p-4">
                          <h3 className="font-semibold text-white mb-3 truncate" title={item.name}>
                            {item.name}
                          </h3>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-300">Points Value:</span>
                              <span className="text-yellow-300 font-semibold">{value.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-slate-300">Quantity:</span>
                              <span className="text-blue-300 font-semibold">×{quantity}</span>
                            </div>
                            
                            <div className="pt-2 border-t border-slate-600">
                              <div className="flex justify-between">
                                <span className="text-slate-300">Total Points:</span>
                                <span className="text-green-300 font-bold">{(value * quantity).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
