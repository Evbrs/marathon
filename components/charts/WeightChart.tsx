'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend
} from 'recharts'
import type { WeightEntry } from '@/lib/types'

interface Props {
  entries: (WeightEntry & { id: string })[]
  targetWeight?: number
  targetDate?: string
}

function buildTargetLine(
  entries: WeightEntry[],
  targetWeight: number,
  targetDate: string
): { date: string; target: number }[] {
  if (entries.length === 0) return []
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const startDate = sorted[0].date
  const startWeight = sorted[0].weight
  const start = new Date(startDate).getTime()
  const end = new Date(targetDate).getTime()
  const duration = end - start
  const drop = startWeight - targetWeight

  const points = []
  const step = duration / 20
  for (let i = 0; i <= 20; i++) {
    const t = start + i * step
    const d = new Date(t).toISOString().split('T')[0]
    const w = Math.round((startWeight - (drop * (i / 20))) * 10) / 10
    points.push({ date: d.slice(5), target: w })
  }
  return points
}

export function WeightChart({ entries, targetWeight = 73, targetDate = '2027-04-06' }: Props) {
  if (entries.length === 0) {
    return <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Aucune entrée de poids</div>
  }

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const targetLine = buildTargetLine(sorted, targetWeight, targetDate)

  const actual = sorted.map((e) => ({ date: e.date.slice(5), weight: e.weight, fat: e.bodyFatPct }))

  // Merge for recharts
  const dateSet = new Set([...actual.map((a) => a.date), ...targetLine.map((t) => t.date)])
  const allDates = [...dateSet].sort()
  const actualMap = Object.fromEntries(actual.map((a) => [a.date, a.weight]))
  const targetMap = Object.fromEntries(targetLine.map((t) => [t.date, t.target]))

  const data = allDates.map((d) => ({
    date: d,
    Poids: actualMap[d],
    Objectif: targetMap[d],
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[68, 82]} unit=" kg" />
        <Tooltip formatter={(val) => [`${val} kg`, '']} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="Poids" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} connectNulls={false} />
        <Line type="monotone" dataKey="Objectif" stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
