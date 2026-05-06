export const dynamic = 'force-dynamic'

import { getAll } from '@/lib/storage'
import type { Session } from '@/lib/types'
import { SessionCard } from '@/components/SessionCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function SessionsPage() {
  const sessions = await getAll<Session>('sessions')
  const sorted = sessions.sort((a, b) => b.date.localeCompare(a.date))

  const runningTypes = ['easy', 'threshold', 'interval', 'long', 'race']
  const runSessions = sorted.filter((s) => runningTypes.includes(s.type))
  const crossSessions = sorted.filter((s) => !runningTypes.includes(s.type))

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Séances</h1>
          <p className="text-sm text-gray-500">{sorted.length} séances enregistrées</p>
        </div>
        <div className="flex gap-2">
          <Link href="/sessions/import">
            <Button size="sm">Importer TCX</Button>
          </Link>
          <Link href="/sessions/new">
            <Button size="sm" variant="outline">+ Manuel</Button>
          </Link>
        </div>
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🏃</div>
          <p className="text-gray-500 mb-4">Aucune séance pour l'instant</p>
          <Link href="/sessions/import">
            <Button>Importer un fichier TCX</Button>
          </Link>
        </div>
      )}

      {runSessions.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Course à pied</h2>
          <div className="space-y-2">
            {runSessions.map((s) => <SessionCard key={s.id} session={s} />)}
          </div>
        </section>
      )}

      {crossSessions.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Cross-training & sport</h2>
          <div className="space-y-2">
            {crossSessions.map((s) => <SessionCard key={s.id} session={s} />)}
          </div>
        </section>
      )}
    </div>
  )
}
