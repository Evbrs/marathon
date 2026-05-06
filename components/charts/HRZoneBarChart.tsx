'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { HRZones } from '@/lib/types'
import { HR_ZONES, formatDuration } from '@/lib/training-zones'

interface Props {
  hrZones: HRZones
}

export function HRZoneBarChart({ hrZones }: Props) {
  const total = Object.values(hrZones).reduce((s, v) => s + v, 0)
  if (total === 0) return <div className="h-24 flex items-center justify-center text-gray-400 text-sm">Pas de données FC</div>

  const data = Object.entries(HR_ZONES).map(([key, zone]) => ({
    name: zone.label,
    seconds: hrZones[key as keyof HRZones],
    pct: total > 0 ? Math.round((hrZones[key as keyof HRZones] / total) * 100) : 0,
    color: zone.color,
  }))

  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(val) => [
            `${formatDuration(Number(val))} (${Math.round((Number(val) / total) * 100)}%)`,
            'Temps',
          ]}
        />
        <Bar dataKey="seconds" radius={[0, 4, 4, 0]} label={{ position: 'right', fontSize: 11, formatter: (v: unknown) => `${Math.round((Number(v) / total) * 100)}%` }}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
