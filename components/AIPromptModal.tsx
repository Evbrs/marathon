'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  prompt: string
  title: string
  existingReview?: string
  onSave?: (review: string) => Promise<void>
  onClose: () => void
}

export function AIPromptModal({ prompt, title, existingReview, onSave, onClose }: Props) {
  const [review, setReview] = useState(existingReview ?? '')
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSave() {
    if (!onSave || !review.trim()) return
    setSaving(true)
    try {
      await onSave(review.trim())
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-xl">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">🤖 {title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">Utilise ton abonnement Claude Code — pas de coût API supplémentaire</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <div className="p-5 space-y-4">
          {/* Step 1: Copy prompt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs font-bold mr-2">1</span>
                Copie ce prompt
              </label>
              <Button size="sm" variant="outline" onClick={handleCopy}>
                {copied ? '✓ Copié !' : 'Copier le prompt'}
              </Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-auto">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">{prompt}</pre>
            </div>
          </div>

          {/* Step 2: Open Claude */}
          <div className="flex items-center gap-3 bg-violet-50 rounded-lg px-4 py-3">
            <span className="bg-indigo-100 text-indigo-700 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs font-bold shrink-0">2</span>
            <div className="flex-1">
              <p className="text-sm text-gray-700">Colle le prompt dans <strong>Claude.ai</strong> ou ton terminal Claude Code</p>
            </div>
            <a
              href="https://claude.ai/new"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-medium"
            >
              Ouvrir Claude →
            </a>
          </div>

          {/* Step 3: Paste response */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              <span className="bg-indigo-100 text-indigo-700 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs font-bold mr-2">3</span>
              Colle la réponse de Claude ici
            </label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Colle ici l'analyse de Claude…"
              rows={8}
              className="text-sm font-mono resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            {onSave && (
              <Button onClick={handleSave} disabled={!review.trim() || saving}>
                {saving ? 'Sauvegarde…' : 'Sauvegarder l\'analyse'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
