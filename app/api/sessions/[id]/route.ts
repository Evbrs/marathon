import { NextResponse } from 'next/server'
import { getById, upsert, remove } from '@/lib/storage'
import type { Session } from '@/lib/types'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getById<Session>('sessions', id)
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(session)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const updated = await upsert<Session>('sessions', { ...body, id })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await remove('sessions', id)
  return NextResponse.json({ ok: true })
}
