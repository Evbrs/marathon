import { NextResponse } from 'next/server'
import { getAll, upsert } from '@/lib/storage'
import type { PlanProgress } from '@/lib/types'

export async function GET() {
  const progress = await getAll<PlanProgress & { id: string }>('plan_progress')
  return NextResponse.json(progress)
}

export async function POST(req: Request) {
  const body: PlanProgress = await req.json()
  const entry = { ...body, id: `${body.weekId}-${body.sessionIndex}` }
  const saved = await upsert('plan_progress', entry)
  return NextResponse.json(saved, { status: 201 })
}
