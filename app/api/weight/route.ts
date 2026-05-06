import { NextResponse } from 'next/server'
import { getAll, upsert } from '@/lib/storage'
import type { WeightEntry } from '@/lib/types'

export async function GET() {
  const log = await getAll<WeightEntry & { id: string }>('weight_log')
  return NextResponse.json(log.sort((a, b) => b.date.localeCompare(a.date)))
}

export async function POST(req: Request) {
  const body: WeightEntry = await req.json()
  const entry = {
    ...body,
    id: body.date, // date as id — one entry per day
    leanMassKg: body.bodyFatPct
      ? Math.round(body.weight * (1 - body.bodyFatPct / 100) * 10) / 10
      : undefined,
  }
  const saved = await upsert('weight_log', entry)
  return NextResponse.json(saved, { status: 201 })
}
