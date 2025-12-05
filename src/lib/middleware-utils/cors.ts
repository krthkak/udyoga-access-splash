import { NextRequest } from 'next/server'

export function getAllowedOrigin(request: NextRequest): string | null {
  const origin = request.headers.get('origin') || ''
  const raw = process.env.ALLOWED_ORIGINS || ''
  const allowed = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (allowed.length === 0) return '*' // fallback for local dev
  return allowed.includes(origin) ? origin : null
}

export function getCorsHeaders(origin: string): Headers {
  return new Headers({
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '600',
  })
}
