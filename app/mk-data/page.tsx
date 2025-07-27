'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Database, Search, Download, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { MKSeasonData } from '@/lib/supabase'

interface MKDataItem {
  name: string
  values: number[]
  quantities: number[]
}

export default function MKDataPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [mkSeasonsData, setMkSeasonsData] = useState<MKDataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch MK seasons data from Supabase
  useEffect(() => {
    const fetchMKData = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from('mk_seasons_data')
          .select('*')
          .order('item_name')
        
        if (error) {
          console.error('Error fetching MK data:', error)
          setError('Failed to load MK seasons data')
          return
        }
        
        // Transform the data to match the expected format
        const transformedData: MKDataItem[] = data.map((item: MKSeasonData) => ({
          name: item.item_name,
          values: item.season_values,
          quantities: item.season_quantities
        }))
        
        setMkSeasonsData(transformedData)
      } catch (err) {
        console.error('Error fetching MK data:', err)
        setError('Failed to load MK seasons data')
      } finally {
        setLoading(false)
      }
    }

    fetchMKData()
  }, [])
  
  const filteredData = mkSeasonsData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const generateSeasonOptions = () => {
    const seasons = []
    for (let i = 1; i <= 47; i++) {
      seasons.push(i)
    }
    return seasons
  }

  const downloadCSV = () => {
    let csvContent = "Item Name,Season,Points Value,Quantity\n"
    
    filteredData.forEach(item => {
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

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="ml-64 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
                <p className="text-white">Loading MK seasons data...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="ml-64 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
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
                          {Array.from({ length: 47 }, (_, i) => i + 1).map(season => (
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
