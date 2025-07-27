'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { BagItem, PREDEFINED_BAG_ITEMS } from '@/types'
import { getItemImageName } from '@/lib/itemImages'
import Image from 'next/image'

interface BagItemWithQuantity {
  name: string
  quantity: number
}

export default function BagPage() {
  const { user } = useAuth()
  const [bagItems, setBagItems] = useState<BagItemWithQuantity[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadBagItems()
    }
  }, [user]) // loadBagItems is stable, no need to include it

  const loadBagItems = async () => {
    try {
      const { data, error } = await supabase
        .from('bag_items')
        .select('*')
        .eq('user_id', user!.id)

      if (error) throw error

      // Create a map of existing items
      const existingItems = new Map<string, number>(
        data.map((item: BagItem) => [item.item_name, item.quantity])
      )

      // Combine predefined items with existing data
      const allItems: BagItemWithQuantity[] = PREDEFINED_BAG_ITEMS.map((itemName: string) => ({
        name: itemName,
        quantity: existingItems.get(itemName) ?? 0
      }))

      // Add custom items that aren't in predefined list
      data.forEach((item: BagItem) => {
        if (!PREDEFINED_BAG_ITEMS.includes(item.item_name as typeof PREDEFINED_BAG_ITEMS[number])) {
          allItems.push({
            name: item.item_name,
            quantity: item.quantity
          })
        }
      })

      setBagItems(allItems)
    } catch (error) {
      console.error('Error loading bag items:', error)
      toast.error('Failed to load bag items')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = (itemName: string, quantity: number) => {
    setBagItems(items => 
      items.map(item => 
        item.name === itemName ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    )
  }

  const saveBagItems = async () => {
    if (!user) return

    setSaving(true)
    try {
      // Prepare upsert data
      const upsertData = bagItems
        .filter(item => item.quantity > 0) // Only save items with quantity > 0
        .map(item => ({
          user_id: user.id,
          item_name: item.name,
          quantity: item.quantity
        }))

      // First, delete items with 0 quantity
      const itemsToDelete = bagItems
        .filter(item => item.quantity === 0)
        .map(item => item.name)

      if (itemsToDelete.length > 0) {
        await supabase
          .from('bag_items')
          .delete()
          .eq('user_id', user.id)
          .in('item_name', itemsToDelete)
      }

      // Then upsert items with quantity > 0
      if (upsertData.length > 0) {
        const { error } = await supabase
          .from('bag_items')
          .upsert(upsertData, { 
            onConflict: 'user_id,item_name',
            ignoreDuplicates: false 
          })

        if (error) throw error
      }

      toast.success('Bag items saved successfully!')
    } catch (error) {
      console.error('Error saving bag items:', error)
      toast.error('Failed to save bag items')
    } finally {
      setSaving(false)
    }
  }

  const addNewItem = async () => {
    if (!newItemName.trim()) {
      toast.error('Please enter an item name')
      return
    }

    if (bagItems.some(item => item.name.toLowerCase() === newItemName.toLowerCase())) {
      toast.error('Item already exists')
      return
    }

    const newItem: BagItemWithQuantity = {
      name: newItemName.trim(),
      quantity: Math.max(0, newItemQuantity)
    }

    setBagItems(items => [...items, newItem])
    setNewItemName('')
    setNewItemQuantity(0)
    setIsDialogOpen(false)
    toast.success('Item added successfully!')
  }

  // Group items into categories
  const categories = {
    'Currency': bagItems.filter(item => 
      item.name.includes('Gold') || item.name === 'Diamonds'
    ),
    'Magic Books': bagItems.filter(item => 
      item.name.includes('Magic Book')
    ),
    'Blueprints': bagItems.filter(item => 
      item.name.includes('Blueprint')
    ),
    'Magic Dust': bagItems.filter(item => 
      item.name.includes('Magic Dust')
    ),
    'EXP Books': bagItems.filter(item => 
      item.name.includes('EXP Book')
    ),
    'Dragon Items': bagItems.filter(item => 
      item.name.includes('Dragon') || item.name.includes('Rune')
    ),
    'Hero Cards': bagItems.filter(item => 
      item.name.includes('Hero Card') || item.name === 'Free-Pick Hero'
    ),
    'Potions & Spells': bagItems.filter(item => 
      item.name.includes('Potion') || item.name.includes('Spell') || 
      item.name.includes('Vial') || item.name.includes('Blood')
    ),
    'Action Points': bagItems.filter(item => 
      item.name.includes('Action Points')
    ),
    'Other Items': bagItems.filter(item => {
      const excludeCategories = [
        'Gold', 'Diamonds', 'Magic Book', 'Blueprint', 'Magic Dust', 
        'EXP Book', 'Dragon', 'Rune', 'Hero Card', 'Free-Pick Hero', 'Potion', 'Spell', 'Vial', 
        'Blood', 'Action Points'
      ]
      return !excludeCategories.some(cat => item.name.includes(cat) || item.name === 'Free-Pick Hero')
    })
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
    <ProtectedRoute saveFunction={saveBagItems} saving={saving}>
      <div className="ml-64 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-3 py-4 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">Your Bag</h1>
            <div className="flex space-x-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-green-600/80 hover:bg-green-500 border-green-400 text-white text-sm">
                    <Plus className="h-3 w-3" />
                    <span>Add Item</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-white">Add Custom Item</DialogTitle>
                    <DialogDescription className="text-slate-300">
                      Add a custom item to your bag. It will appear in the "Other Items" category.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="item-name" className="text-sm text-slate-200 font-medium">Item Name</Label>
                      <Input
                        id="item-name"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Enter item name"
                        className="bg-slate-700 border-slate-600 text-white text-sm"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-quantity" className="text-sm text-slate-200 font-medium">Initial Quantity</Label>
                      <Input
                        id="item-quantity"
                        type="number"
                        min="0"
                        step="1"
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 0)}
                        className="bg-slate-700 border-slate-600 text-white text-sm"
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsDialogOpen(false)
                        setNewItemName('')
                        setNewItemQuantity(0)
                      }} 
                      className="text-sm border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={addNewItem} 
                      className="bg-green-600 hover:bg-green-500 text-white text-sm"
                      disabled={!newItemName.trim()}
                    >
                      Add Item
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Accordion type="multiple" defaultValue={Object.keys(categories)} className="w-full space-y-2">
            {Object.entries(categories).map(([category, items]) => (
              items.length > 0 && (
                <AccordionItem key={category} value={category} className="border border-slate-600/50 bg-slate-800/30 backdrop-blur-sm rounded-lg">
                  <AccordionTrigger className="text-base font-semibold text-white hover:text-blue-300 px-4 py-2 hover:no-underline">
                    {category} ({items.length})
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-1.5">
                      {items.map((item) => (
                        <div key={item.name} className="relative group">
                          <div className="bg-gradient-to-b from-slate-700 to-slate-800 border border-slate-600 rounded-lg p-1.5 hover:border-blue-400 transition-all duration-200 shadow-lg">
                            <div className="aspect-square bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-md mb-1.5 flex items-center justify-center border border-amber-500/30 overflow-hidden">
                              <Image
                                src={`/images/items/${getItemImageName(item.name)}.png`}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover rounded-sm"
                                onError={(e) => {
                                  // Try SVG format first, then fallback to default
                                  const target = e.target as HTMLImageElement;
                                  if (target.src.endsWith('.png')) {
                                    target.src = `/images/items/${getItemImageName(item.name)}.svg`;
                                  } else {
                                    target.src = '/images/items/default_item.svg';
                                  }
                                }}
                                unoptimized
                              />
                            </div>
                            <div className="space-y-1">
                              <div 
                                className="text-[10px] font-medium text-white leading-tight text-center px-0.5 min-h-[24px] flex items-center justify-center" 
                                title={item.name}
                                style={{
                                  fontSize: '9px',
                                  lineHeight: '1.1',
                                  wordBreak: 'break-word',
                                  hyphens: 'auto'
                                }}
                              >
                                {item.name}
                              </div>
                              <Input
                                type="number"
                                min="0"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.name, parseInt(e.target.value) || 0)}
                                className="h-5 text-[10px] text-center bg-slate-900/50 border-slate-600 text-white focus:border-blue-400 px-1"
                              />
                            </div>
                            <div className="absolute -top-0.5 -right-0.5 bg-green-600 text-white text-[8px] px-1 py-0.5 rounded-full font-bold shadow-lg min-w-[16px] text-center">
                              {item.quantity > 999 ? `${Math.floor(item.quantity/1000)}k` : item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            ))}
          </Accordion>
        </div>
      </div>
    </ProtectedRoute>
  )
}
