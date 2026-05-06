'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function WeightForm() {
  const router = useRouter()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [weight, setWeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          weight: Number(weight),
          bodyFatPct: bodyFat ? Number(bodyFat) : undefined,
        }),
      })
      setWeight('')
      setBodyFat('')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
      <div className="space-y-1">
        <Label className="text-xs">Date</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-36" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Poids (kg)</Label>
        <Input type="number" step="0.1" min="50" max="120" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="79.5" className="w-24" required />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Masse grasse % (optionnel)</Label>
        <Input type="number" step="0.1" min="5" max="40" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} placeholder="15.2" className="w-24" />
      </div>
      <Button type="submit" disabled={loading} size="sm">
        {loading ? '…' : 'Enregistrer'}
      </Button>
    </form>
  )
}
