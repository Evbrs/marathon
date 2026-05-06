import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { createToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(req: Request) {
  const { password } = await req.json()

  const hash = process.env.APP_PASSWORD_HASH ?? ''

  if (!hash) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  const valid = await compare(password, hash)
  if (!valid) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  const token = await createToken()

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
  return res
}
