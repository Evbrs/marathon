import { NextResponse } from 'next/server'
import { getAll, upsert, remove } from '@/lib/storage'
import { monotonicFactory } from 'ulid'
import type { GarminStats } from '@/lib/types'

const ulid = monotonicFactory()

export async function GET() {
  const stats = await getAll<GarminStats>('garmin_stats')
  return NextResponse.json(stats.sort((a, b) => b.date.localeCompare(a.date)))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const stat: GarminStats = { ...body, id: body.id ?? ulid() }
    const saved = await upsert('garmin_stats', stat)
    return NextResponse.json(saved, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[garmin-stats POST]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  await remove('garmin_stats', id)
  return NextResponse.json({ ok: true })
}
