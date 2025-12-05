import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validator } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = validator.validate<{ name: string; email: string; message: string }>('message.create', json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'validation_error', details: parsed.error }, { status: 400 })
    }

    const saved = await (prisma as any).message.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
      },
    })

    return NextResponse.json({ id: saved.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

export async function GET() {
  // Disallow listing to keep it simple and non-abusive for public endpoint
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 })
}


