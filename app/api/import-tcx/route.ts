import { NextResponse } from 'next/server'
import { parseTcx } from '@/lib/tcx-parser'
import { upsert } from '@/lib/storage'
import { monotonicFactory } from 'ulid'
import type { Session, SessionType } from '@/lib/types'

const ulid = monotonicFactory()

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const sessionType = (formData.get('type') as SessionType) ?? 'easy'
  const feeling = Number(formData.get('feeling') ?? 3) as 1 | 2 | 3 | 4 | 5
  const notes = (formData.get('notes') as string) ?? ''
  const customLabel = (formData.get('customLabel') as string) ?? ''

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  try {
    const xml = await file.text()
    const parsed = await parseTcx(xml)

    const session: Session = {
      id: ulid(),
      date: parsed.date,
      type: sessionType,
      source: 'tcx',
      distance: parsed.distance,
      duration: parsed.duration,
      avgPace: parsed.avgPace,
      avgHR: parsed.avgHR,
      maxHR: parsed.maxHR,
      avgCadence: parsed.avgCadence,
      elevationGain: parsed.elevationGain,
      laps: parsed.laps,
      hrZones: parsed.hrZones,
      feeling,
      notes,
      customLabel: customLabel || undefined,
    }

    const saved = await upsert('sessions', session)
    return NextResponse.json(saved, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Parse error'
    return NextResponse.json({ error: msg }, { status: 422 })
  }
}
