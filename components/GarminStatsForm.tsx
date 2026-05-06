'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function timeToSeconds(val: string): number {
  const parts = val.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return 0
}

export function GarminStatsForm() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [vo2max, setVo2max] = useState('')
  const [lactatePace, setLactatePace] = useState('')
  const [lactateHR, setLactateHR] = useState('')
  const [pred5k, setPred5k] = useState('')
  const [pred10k, setPred10k] = useState('')
  const [predSemi, setPredSemi] = useState('')
  const [predMarathon, setPredMarathon] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/garmin-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          vo2max: Number(vo2max),
          lactatePace: timeToSeconds(lactatePace),
          lactateHR: Number(lactateHR),
          predictions: {
            km5: timeToSeconds(pred5k),
            km10: timeToSeconds(pred10k),
            semi: timeToSeconds(predSemi),
            marathon: timeToSeconds(predMarathon),
          },
        }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">VO2max (ml/kg/min)</Label>
          <Input type="number" step="0.1" min="30" max="90" value={vo2max} onChange={(e) => setVo2max(e.target.value)} placeholder="51" required />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Allure seuil (mm:ss)</Label>
          <Input value={lactatePace} onChange={(e) => setLactatePace(e.target.value)} placeholder="4:53" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">FC seuil (bpm)</Label>
          <Input type="number" value={lactateHR} onChange={(e) => setLactateHR(e.target.value)} placeholder="181" />
        </div>
      </div>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Prédictions de course</div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: '5 km (mm:ss)', val: pred5k, set: setPred5k, placeholder: '24:17' },
          { label: '10 km (mm:ss)', val: pred10k, set: setPred10k, placeholder: '51:37' },
          { label: 'Semi (h:mm:ss)', val: predSemi, set: setPredSemi, placeholder: '1:53:00' },
          { label: 'Marathon (h:mm:ss)', val: predMarathon, set: setPredMarathon, placeholder: '3:55:00' },
        ].map((f) => (
          <div key={f.label} className="space-y-1">
            <Label className="text-xs">{f.label}</Label>
            <Input value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder} />
          </div>
        ))}
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Sauvegarde…' : 'Enregistrer'}
      </Button>
    </form>
  )
}
