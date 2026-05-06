'use client'

import { useState } from 'react'
import type { Session } from '@/lib/types'
import { generateSessionReviewPrompt } from '@/lib/ai-prompts'
import { AIPromptModal } from '@/components/AIPromptModal'
import { Button } from '@/components/ui/button'

interface Props {
  session: Session
  recentSessions: Session[]
}

export function SessionAIReview({ session, recentSessions }: Props) {
  const [open, setOpen] = useState(false)
  const prompt = generateSessionReviewPrompt(session, recentSessions)

  async function handleSave(review: string) {
    await fetch(`/api/sessions/${session.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...session, aiReview: review }),
    })
    window.location.reload()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold text-gray-900 text-sm">Review IA</div>
          <div className="text-xs text-gray-400">Analyse par Claude (ton abonnement)</div>
        </div>
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          {session.aiReview ? '✏️ Modifier' : '🤖 Analyser'}
        </Button>
      </div>

      {session.aiReview ? (
        <div className="bg-violet-50 rounded-lg p-3">
          <div className="text-sm text-gray-700 whitespace-pre-wrap">{session.aiReview}</div>
        </div>
      ) : (
        <div className="text-sm text-gray-400 italic">
          Pas encore d'analyse IA. Clique sur "Analyser" pour générer un prompt à coller dans Claude.
        </div>
      )}

      {open && (
        <AIPromptModal
          prompt={prompt}
          title={`Analyse séance — ${session.date}`}
          existingReview={session.aiReview}
          onSave={handleSave}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}
