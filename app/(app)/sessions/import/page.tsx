'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { SESSION_TYPES } from '@/lib/training-zones'

export default function ImportTcxPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [type, setType] = useState('easy')
  const [feeling, setFeeling] = useState(3)
  const [notes, setNotes] = useState('')
  const [customLabel, setCustomLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  function handleFile(f: File) {
    if (!f.name.endsWith('.tcx') && !f.name.endsWith('.gpx')) {
      setError('Format non supporté. Utilise un fichier .tcx (exporté depuis Garmin Connect).')
      return
    }
    setFile(f)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) { setError('Sélectionne un fichier TCX'); return }
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('type', type)
      fd.append('feeling', String(feeling))
      fd.append('notes', notes)
      fd.append('customLabel', customLabel)

      const res = await fetch('/api/import-tcx', { method: 'POST', body: fd })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? 'Erreur lors de l\'import')
      }
      const session = await res.json()
      router.push(`/sessions/${session.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Importer une séance</h1>
        <p className="text-sm text-gray-500">Fichier TCX exporté depuis Garmin Connect</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-indigo-400 bg-indigo-50' : file ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input ref={fileRef} type="file" accept=".tcx,.gpx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          {file ? (
            <>
              <div className="text-3xl mb-2">✅</div>
              <div className="font-medium text-gray-900">{file.name}</div>
              <div className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(0)} KB — cliquer pour changer</div>
            </>
          ) : (
            <>
              <div className="text-3xl mb-2">📁</div>
              <div className="font-medium text-gray-700">Glisser le fichier TCX ici</div>
              <div className="text-xs text-gray-400 mt-1">ou cliquer pour parcourir</div>
            </>
          )}
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <Label>Type de séance</Label>
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

        {/* Custom label for cross-training */}
        {['tennis', 'basketball', 'other'].includes(type) && (
          <div className="space-y-1.5">
            <Label>Label personnalisé (optionnel)</Label>
            <Input value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} placeholder="Ex: Match de tennis amical" />
          </div>
        )}

        {/* Feeling */}
        <div className="space-y-1.5">
          <Label>Ressenti ({['😫', '😕', '😐', '😊', '🔥'][feeling - 1]})</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setFeeling(v)}
                className={`flex-1 py-2 rounded-lg border text-lg transition-colors ${feeling === v ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                {['😫', '😕', '😐', '😊', '🔥'][v - 1]}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label>Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Conditions, sensations, objectifs de la séance…"
            rows={3}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Import en cours…' : 'Importer la séance'}
        </Button>
      </form>

      <div className="mt-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Comment exporter depuis Garmin ?</h3>
        <ol className="text-sm text-gray-500 space-y-1">
          <li>1. Ouvre <strong>Garmin Connect</strong> (web ou app)</li>
          <li>2. Clique sur la séance → <strong>•••</strong> → Exporter en TCX</li>
          <li>3. Glisse le fichier ici</li>
        </ol>
      </div>
    </div>
  )
}
