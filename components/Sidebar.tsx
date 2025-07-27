'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, Calculator, Database } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Bag',
    href: '/bag',
    icon: Package,
    description: 'Manage your inventory'
  },
  {
    name: 'MK Event',
    href: '/mk',
    icon: Calculator,
    description: 'Calculate event points'
  },
  {
    name: 'MK Data',
    href: '/mk-data',
    icon: Database,
    description: 'Historical season data'
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-14 bottom-0 w-64 bg-slate-900/80 backdrop-blur-sm border-r border-slate-700/50 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent hover:border-slate-600/30'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
                )}
              />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className={cn(
                  'text-xs mt-0.5',
                  isActive ? 'text-blue-200' : 'text-slate-500 group-hover:text-slate-300'
                )}>
                  {item.description}
                </div>
              </div>
              {isActive && (
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              )}
            </Link>
          )
        })}
      </nav>
      
      {/* Additional sidebar content */}
      <div className="p-4 mt-8 border-t border-slate-700/50">
        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
          Quick Stats
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Items in Bag</span>
            <span className="text-white font-medium">-</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">MK Total Points</span>
            <span className="text-yellow-400 font-medium">-</span>
          </div>
        </div>
      </div>
    </div>
  )
}
