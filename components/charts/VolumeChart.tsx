'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { Session } from '@/lib/types'

interface Props {
  sessions: Session[]
}

function getWeekLabel(date: Date): string {
  const monday = new Date(date)
  monday.setDate(date.getDate() - ((date.getDay() + 6) % 7))
  return monday.toISOString().slice(5, 10) // MM-DD
}

export function VolumeChart({ sessions }: Props) {
  const weekMap: Record<string, number> = {}
  for (const s of sessions) {
    const d = new Date(s.date)
    const key = getWeekLabel(d)
    weekMap[key] = (weekMap[key] ?? 0) + (s.distance ?? 0)
  }

  const data = Object.entries(weekMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-16)
    .map(([week, km]) => ({ week, km: Math.round(km * 10) / 10 }))

  if (data.length === 0) {
    return <div className="h-40 flex items-center justify-center text-gray-400 text-sm">Aucune donnée</div>
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 10 }} tickLine={false} interval={1} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} unit=" km" />
        <Tooltip formatter={(val) => [`${val} km`, 'Volume']} />
        <Bar dataKey="km" fill="#6366f1" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
