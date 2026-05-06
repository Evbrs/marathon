'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SESSION_TYPES } from '@/lib/training-zones'
import { monotonicFactory } from 'ulid'

const ulid = monotonicFactory()

export default function NewSessionPage() {
  const router = useRouter()
  const [type, setType] = useState('easy')
  const [customLabel, setCustomLabel] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [distance, setDistance] = useState('')
  const [durationH, setDurationH] = useState('0')
  const [durationM, setDurationM] = useState('0')
  const [durationS, setDurationS] = useState('0')
  const [avgHR, setAvgHR] = useState('')
  const [feeling, setFeeling] = useState(3)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const duration = Number(durationH) * 3600 + Number(durationM) * 60 + Number(durationS)
      const dist = Number(distance)
      const avgPace = dist > 0 && duration > 0 ? Math.round(duration / dist) : 0

      const session = {
        id: ulid(),
        date,
        type,
        source: 'manual',
        distance: dist,
        duration,
        avgPace,
        avgHR: Number(avgHR) || 0,
        maxHR: 0,
        avgCadence: 0,
        laps: [],
        hrZones: { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
        feeling: feeling as 1 | 2 | 3 | 4 | 5,
        notes,
        customLabel: customLabel || undefined,
      }

      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      })
      if (!res.ok) throw new Error('Erreur sauvegarde')
      const saved = await res.json()
      router.push(`/sessions/${saved.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Nouvelle séance manuelle</h1>
        <p className="text-sm text-gray-500">Tennis, basket, vélo, ou toute autre activité</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {SESSION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {['tennis', 'basketball', 'other'].includes(type) && (
          <div className="space-y-1.5">
            <Label>Activité précise</Label>
            <Input value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} placeholder="Ex: Match de tennis, Basket 3v3…" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Distance (km)</Label>
            <Input type="number" step="0.01" min="0" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="0" />
          </div>
          <div className="space-y-1.5">
            <Label>FC moyenne (bpm)</Label>
            <Input type="number" min="0" max="220" value={avgHR} onChange={(e) => setAvgHR(e.target.value)} placeholder="—" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Durée</Label>
          <div className="flex items-center gap-2">
            <Input type="number" min="0" max="23" value={durationH} onChange={(e) => setDurationH(e.target.value)} className="w-20 text-center" />
            <span className="text-gray-400 text-sm">h</span>
            <Input type="number" min="0" max="59" value={durationM} onChange={(e) => setDurationM(e.target.value)} className="w-20 text-center" />
            <span className="text-gray-400 text-sm">min</span>
            <Input type="number" min="0" max="59" value={durationS} onChange={(e) => setDurationS(e.target.value)} className="w-20 text-center" />
            <span className="text-gray-400 text-sm">sec</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Ressenti ({['😫', '😕', '😐', '😊', '🔥'][feeling - 1]})</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button key={v} type="button" onClick={() => setFeeling(v)}
                className={`flex-1 py-2 rounded-lg border text-lg ${feeling === v ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'}`}>
                {['😫', '😕', '😐', '😊', '🔥'][v - 1]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Notes</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Match, score, sensations…" rows={3} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sauvegarde…' : 'Enregistrer la séance'}
        </Button>
      </form>
    </div>
  )
}
