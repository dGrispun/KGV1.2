'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Camera, Upload, X } from 'lucide-react'
import { BagItem, PREDEFINED_BAG_ITEMS } from '@/types'
import { getItemImageName } from '@/lib/itemImages'
import Image from 'next/image'
import Tesseract from 'tesseract.js'
import Fuse from 'fuse.js'

interface BagItemWithQuantity {
  name: string
  quantity: number
}

// Predefined items for OCR matching
const OCR_ITEMS = [
  'Gold', 'Diamonds',
  'Tier 8 Magic Book', 'Tier 7 Magic Book', 'Tier 6 Magic Book', 'Tier 5 Magic Book',
  'Tier 4 Magic Book', 'Tier 3 Magic Book', 'Tier 2 Magic Book', 'Tier 1 Magic Book',
  'T9 Forge Blueprint', 'King Forge Blueprint', 'Luxurious Blueprint', 'Peacock Plume Forge Blueprint',
  'Legendary Forge Blueprint', 'Epic Forge Blueprint', 'Perfect Forge Blueprint', 'Excellent Forge Blueprint',
  'Tier 9 Magic Dust', 'Tier 8 Magic Dust', 'Tier 7 Magic Dust', 'Tier 6 Magic Dust',
  'Tier 5 Magic Dust', 'Tier 4 Magic Dust', 'Tier 3 Magic Dust',
  'Blueprint: Gilded Armor', 'Blueprint: Dark Armor', 'Blueprint: Balrog Armor', 'Blueprint: Legendary Armor',
  'Blueprint: Immortal Armor', 'Blueprint: Demonic Armor', 'Blueprint: Cerulean Armor',
  'Perfect Summoning Spell', 'Advanced Summoning Spell', 'Blood of Titan', 'Elemental Vial',
  'Fortune Potion', 'Strenghening Potion', 'Deluxe Dragon Soul Stone', 'Dragon Soul Stone',
  'Stone', 'Forge Hammer', 'Wood', 'Steel',
  '10M Gold', '1M Gold', '500K Gold', '100K Gold', '50k Gold', '10k Gold', '5k Gold', '1k Gold',
  'Tier 4 Archer EXP Book', 'Tier 3 Archer EXP Book', 'Tier 2 Archer EXP Book', 'Tier 1 Archer EXP Book',
  'Tier 4 Flame Mage EXP Book', 'Tier 3 Flame Mage EXP Book', 'Tier 2 Flame Mage EXP Book', 'Tier 1 Flame Mage EXP Book',
  'Tier 4 Ice Wizard EXP Book', 'Tier 3 Ice Wizard EXP Book', 'Tier 2 Ice Wizard EXP Book', 'Tier 1 Ice Wizard EXP Book',
  'Tier 4 Goblin EXP Book', 'Tier 3 Goblin EXP Book', 'Tier 2 Goblin EXP Book', 'Tier 1 Goblin EXP Book',
  'Free-Pick Dragon Rune', 'Epic Dragon Rune', 'Perfect Dragon Rune', 'Excellent Dragon Rune', 'Rare Dragon Rune',
  'Free-Pick Heroes', 'Master Talent Book', 'Crown of the Oractle', 'Skill Shard', 'Gallery Shard',
  'Free-Pick Unit EXP Book', 'Light Reagent', 'Custom Construction Item',
  '200 Action Points', '100 Action Points', '50 Action Points', '20 Action Points', '10 Action Points', '5 Action Points'
]

export default function BagPage() {
  const { user } = useAuth()
  const [bagItems, setBagItems] = useState<BagItemWithQuantity[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // OCR related state
  const [isOcrDialogOpen, setIsOcrDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [detectedItems, setDetectedItems] = useState<Record<string, number>>({})

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

  const quickAdd = (itemName: string, amount: number) => {
    setBagItems(items =>
      items.map(item =>
        item.name === itemName 
          ? { ...item, quantity: item.quantity + amount }
          : item
      )
    )
  }

  const quickSubtract = (itemName: string, amount: number) => {
    setBagItems(items =>
      items.map(item =>
        item.name === itemName 
          ? { ...item, quantity: Math.max(0, item.quantity - amount) }
          : item
      )
    )
  }

  const setQuickValue = (itemName: string, value: number) => {
    setBagItems(items =>
      items.map(item =>
        item.name === itemName 
          ? { ...item, quantity: value }
          : item
      )
    )
  }

  // OCR Functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const processImageWithOCR = async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    setOcrProgress(0)
    setDetectedItems({})

    try {
      const result = await Tesseract.recognize(
        selectedImage,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100))
            }
          }
        }
      )

      const extractedText = result.data.text
      const parsedItems = parseOCRText(extractedText)
      setDetectedItems(parsedItems)
      
      if (Object.keys(parsedItems).length === 0) {
        toast.error('No recognized items found in the image')
      } else {
        toast.success(`Found ${Object.keys(parsedItems).length} items`)
      }
    } catch (error) {
      console.error('OCR Error:', error)
      toast.error('Failed to process image')
    } finally {
      setIsProcessing(false)
      setOcrProgress(0)
    }
  }

  const parseOCRText = (text: string): Record<string, number> => {
    const fuse = new Fuse(OCR_ITEMS, {
      threshold: 0.3, // Fuzzy matching threshold
      includeScore: true,
      keys: ['']
    })

    const lines = text.split('\n')
    const detectedItems: Record<string, number> = {}

    for (const line of lines) {
      // Try to find patterns like "Item Name: 123" or "Item Name 123"
      const patterns = [
        /^(.+?)[:]\s*(\d+[,.]?\d*)/, // "Item Name: 123"
        /^(.+?)\s+(\d+[,.]?\d*)$/, // "Item Name 123"
        /(\d+[,.]?\d*)\s+(.+)$/, // "123 Item Name"
      ]

      for (const pattern of patterns) {
        const match = line.trim().match(pattern)
        if (match) {
          let itemName = ''
          let quantity = 0

          if (pattern.source.includes('(\\d+[,.]?\\d*)\\s+(.+)$')) {
            // Pattern 3: quantity first
            quantity = parseInt(match[1].replace(/[,.]/, '')) || 0
            itemName = match[2].trim()
          } else {
            // Pattern 1 & 2: item name first
            itemName = match[1].trim()
            quantity = parseInt(match[2].replace(/[,.]/, '')) || 0
          }

          // Handle common OCR errors
          itemName = itemName
            .replace(/Oractle/gi, 'Oracle')
            .replace(/Strenghening/gi, 'Strengthening')
            .replace(/\b(\d+)M\b/gi, '$1M Gold')
            .replace(/\b(\d+)K\b/gi, '$1k Gold')

          // Use fuzzy matching to find the closest item
          const searchResults = fuse.search(itemName)
          if (searchResults.length > 0 && searchResults[0].score && searchResults[0].score < 0.4) {
            const matchedItem = searchResults[0].item
            if (quantity > 0) {
              detectedItems[matchedItem] = quantity
            }
          }
          break
        }
      }
    }

    return detectedItems
  }

  const applyDetectedItems = async () => {
    if (Object.keys(detectedItems).length === 0) return

    // Update the bag items with detected quantities
    setBagItems(items =>
      items.map(item => {
        const detectedQuantity = detectedItems[item.name]
        return detectedQuantity !== undefined
          ? { ...item, quantity: detectedQuantity }
          : item
      })
    )

    // Save to database
    setSaving(true)
    try {
      const updatedItems = Object.entries(detectedItems).map(([itemName, quantity]) => ({
        user_id: user!.id,
        item_name: itemName,
        quantity: quantity
      }))

      const { error } = await supabase
        .from('bag_items')
        .upsert(updatedItems, { 
          onConflict: 'user_id,item_name',
          ignoreDuplicates: false 
        })

      if (error) throw error

      toast.success(`Updated ${Object.keys(detectedItems).length} items from screenshot`)
      setIsOcrDialogOpen(false)
      resetOCRState()
    } catch (error) {
      console.error('Error saving detected items:', error)
      toast.error('Failed to save detected items')
    } finally {
      setSaving(false)
    }
  }

  const resetOCRState = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setDetectedItems({})
    setOcrProgress(0)
    setIsProcessing(false)
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
              {/* Screenshot Upload Dialog */}
              <Dialog open={isOcrDialogOpen} onOpenChange={setIsOcrDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-purple-600/80 hover:bg-purple-500 border-purple-400 text-white text-sm">
                    <Camera className="h-3 w-3" />
                    <span>Scan Screenshot</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white">Upload Inventory Screenshot</DialogTitle>
                    <DialogDescription className="text-slate-300">
                      Upload a screenshot of your game inventory to automatically detect items and quantities.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Image Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="screenshot" className="text-sm text-slate-200 font-medium">Select Screenshot</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="screenshot"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="bg-slate-700 border-slate-600 text-white text-sm"
                        />
                        {selectedImage && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedImage(null)
                              setImagePreview(null)
                              setDetectedItems({})
                            }}
                            className="text-red-300 border-red-500/50 hover:bg-red-600/20"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="space-y-2">
                        <Label className="text-sm text-slate-200 font-medium">Preview</Label>
                        <div className="relative max-h-60 overflow-hidden rounded-lg border border-slate-600">
                          <Image
                            src={imagePreview}
                            alt="Screenshot preview"
                            width={400}
                            height={300}
                            className="w-full h-auto object-contain"
                            unoptimized
                          />
                        </div>
                      </div>
                    )}

                    {/* Process Button */}
                    {selectedImage && !isProcessing && Object.keys(detectedItems).length === 0 && (
                      <Button
                        onClick={processImageWithOCR}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Process Screenshot
                      </Button>
                    )}

                    {/* Processing Status */}
                    {isProcessing && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-slate-300">
                          <span>Processing image...</span>
                          <span>{ocrProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${ocrProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Detected Items */}
                    {Object.keys(detectedItems).length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-slate-200 font-medium">
                          Detected Items ({Object.keys(detectedItems).length})
                        </Label>
                        <div className="max-h-40 overflow-y-auto bg-slate-900/50 rounded-lg p-3 space-y-1">
                          {Object.entries(detectedItems).map(([itemName, quantity]) => (
                            <div key={itemName} className="flex justify-between items-center text-sm">
                              <span className="text-slate-300">{itemName}</span>
                              <span className="text-blue-300 font-medium">{quantity.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter className="gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsOcrDialogOpen(false)
                        resetOCRState()
                      }} 
                      className="text-sm border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                    {Object.keys(detectedItems).length > 0 && (
                      <Button 
                        onClick={applyDetectedItems} 
                        disabled={saving}
                        className="bg-purple-600 hover:bg-purple-500 text-white text-sm"
                      >
                        {saving ? 'Applying...' : `Apply ${Object.keys(detectedItems).length} Items`}
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Add Item Dialog */}
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
                      Add a custom item to your bag. It will appear in the &ldquo;Other Items&rdquo; category.
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
