'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import type { Session } from '@/lib/types'
import { formatPace } from '@/lib/training-zones'

interface Props {
  sessions: Session[]
}

const TYPE_COLORS: Record<string, string> = {
  easy: '#34d399',
  threshold: '#f97316',
  interval: '#ef4444',
  long: '#3b82f6',
}

function paceToMinSec(secPerKm: number): number {
  // For Y-axis display: convert to decimal minutes (e.g. 4:30 → 4.5)
  return secPerKm / 60
}

function formatYAxis(val: number): string {
  const min = Math.floor(val)
  const sec = Math.round((val - min) * 60)
  return `${min}:${sec.toString().padStart(2, '0')}`
}

export function PaceProgressChart({ sessions }: Props) {
  const runningSessions = sessions
    .filter((s) => ['easy', 'threshold', 'interval', 'long', 'race'].includes(s.type) && s.avgPace > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-40)

  if (runningSessions.length === 0) {
    return <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Aucune séance course enregistrée</div>
  }

  const data = runningSessions.map((s) => ({
    date: s.date.slice(5), // MM-DD
    pace: Math.round(paceToMinSec(s.avgPace) * 100) / 100,
    type: s.type,
    label: `${s.date} · ${formatPace(s.avgPace)}`,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
        <YAxis
          reversed
          tickFormatter={formatYAxis}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          domain={['auto', 'auto']}
        />
        <Tooltip
          formatter={(val) => [formatYAxis(Number(val)), 'Allure']}
          labelFormatter={(l) => `Date: ${l}`}
        />
        <Line
          type="monotone"
          dataKey="pace"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 3, fill: '#6366f1' }}
          activeDot={{ r: 5 }}
          name="Allure moy."
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
