'use client'

import { useState } from 'react'
import type { PlannedSession } from '@/lib/types'
import { sessionTypeLabel, sessionTypeBadgeColor } from '@/lib/training-zones'

interface Props {
  weekId: string
  sessionIndex: number
  session: PlannedSession
  done: boolean
}

export function PlanWeekCheckbox({ weekId, sessionIndex, session, done: initialDone }: Props) {
  const [done, setDone] = useState(initialDone)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const newDone = !done
    setDone(newDone)
    try {
      await fetch('/api/plan-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekId, sessionIndex, completed: newDone }),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-full text-left flex items-start gap-2.5 px-2 py-1.5 rounded-lg transition-colors ${done ? 'opacity-50' : 'hover:bg-gray-50'}`}
    >
      <span className={`shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center text-xs ${done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300'}`}>
        {done ? '✓' : ''}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${sessionTypeBadgeColor(session.type)}`}>
            {sessionTypeLabel(session.type)}
          </span>
          <span className={`text-sm font-medium ${done ? 'line-through' : 'text-gray-800'}`}>{session.label}</span>
        </div>
        {(session.targetPace || session.targetHR || session.distance || session.duration) && (
          <div className="flex gap-3 mt-0.5 text-xs text-gray-400">
            {session.targetPace && <span>{session.targetPace}</span>}
            {session.targetHR && <span>{session.targetHR}</span>}
            {session.distance && <span>{session.distance}</span>}
            {session.duration && <span>{session.duration}</span>}
          </div>
        )}
        {session.description && (
          <div className="text-xs text-gray-400 mt-0.5 truncate">{session.description}</div>
        )}
      </div>
    </button>
  )
}
