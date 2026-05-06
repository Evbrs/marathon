'use client'

import { useState } from 'react'
import type { Session, GarminStats, WeightEntry } from '@/lib/types'
import { generateOverviewPrompt } from '@/lib/ai-prompts'
import { AIPromptModal } from '@/components/AIPromptModal'
import { Button } from '@/components/ui/button'

interface Props {
  sessions: Session[]
  garminStats: GarminStats[]
  weightLog: (WeightEntry & { id: string })[]
}

export function DashboardAI({ sessions, garminStats, weightLog }: Props) {
  const [open, setOpen] = useState(false)
  const prompt = generateOverviewPrompt(sessions, garminStats, weightLog)

  return (
    <>
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl p-4 border border-violet-100 flex items-center gap-4">
        <span className="text-2xl">🤖</span>
        <div className="flex-1">
          <div className="font-semibold text-gray-900 text-sm">Bilan de forme IA</div>
          <div className="text-xs text-gray-500 mt-0.5">
            Analyse complète de ton entraînement des 6 dernières semaines par Claude
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => setOpen(true)} className="shrink-0">
          Demander à Claude
        </Button>
      </div>

      {open && (
        <AIPromptModal
          prompt={prompt}
          title="Bilan de forme global"
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
