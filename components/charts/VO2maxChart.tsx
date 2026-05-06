'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import type { GarminStats } from '@/lib/types'
import { formatRacePred } from '@/lib/training-zones'

interface Props {
  stats: GarminStats[]
}

export function VO2maxChart({ stats }: Props) {
  if (stats.length === 0) {
    return <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Aucune stat Garmin enregistrée</div>
  }

  const data = [...stats]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((s) => ({
      date: s.date.slice(5),
      vo2max: s.vo2max,
      km5: Math.round(s.predictions.km5 / 60 * 100) / 100,
      marathon: Math.round(s.predictions.marathon / 3600 * 100) / 100,
    }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
        <YAxis yAxisId="vo2" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[45, 65]} />
        <Tooltip
          formatter={(val, name) => {
            if (name === 'VO2max') return [`${val} ml/kg/min`, name as string]
            return [val, name as string]
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line yAxisId="vo2" type="monotone" dataKey="vo2max" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="VO2max" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function RacePredChart({ stats }: Props) {
  if (stats.length === 0) return null

  const data = [...stats]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((s) => ({
      date: s.date.slice(5),
      '5km': Math.round(s.predictions.km5 / 60 * 10) / 10,
      '10km': Math.round(s.predictions.km10 / 60 * 10) / 10,
      'Semi': Math.round(s.predictions.semi / 60 * 10) / 10,
      'Marathon': Math.round(s.predictions.marathon / 60 * 10) / 10,
    }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} reversed domain={['auto', 'auto']} tickFormatter={(v) => `${Math.floor(v)}m`} />
        <Tooltip formatter={(val) => [`${Math.floor(Number(val))}m${Math.round((Number(val) % 1) * 60)}s`, '']} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="5km" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="10km" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="Semi" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="Marathon" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
