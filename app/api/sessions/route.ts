import { NextResponse } from 'next/server'
import { getAll, upsert } from '@/lib/storage'
import type { Session } from '@/lib/types'

export async function GET() {
  const sessions = await getAll<Session>('sessions')
  const sorted = sessions.sort((a, b) => b.date.localeCompare(a.date))
  return NextResponse.json(sorted)
}

export async function POST(req: Request) {
  const session: Session = await req.json()
  const saved = await upsert('sessions', session)
  return NextResponse.json(saved, { status: 201 })
}
