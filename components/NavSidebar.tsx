'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/sessions', icon: '🏃', label: 'Séances' },
  { href: '/plan', icon: '📅', label: 'Programme' },
  { href: '/stats', icon: '📈', label: 'Stats Garmin' },
  { href: '/weight', icon: '⚖️', label: 'Poids' },
  { href: '/nutrition', icon: '🥗', label: 'Nutrition' },
]

export function NavSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function logout() {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col border-r border-gray-100 bg-white min-h-screen">
      <div className="px-5 py-6 border-b border-gray-100">
        <div className="text-lg font-bold text-gray-900">🏃 Marathon</div>
        <div className="text-xs text-gray-400 mt-0.5">Paris 2027 · sub-3h30</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={logout}
          disabled={loggingOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 w-full transition-colors"
        >
          <span className="text-base">🚪</span>
          Déconnexion
        </button>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors',
                active ? 'text-gray-900' : 'text-gray-400'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
