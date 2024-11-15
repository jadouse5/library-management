import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const dvds = await prisma.dVD.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(dvds)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching DVDs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const dvd = await prisma.dVD.create({
      data: json,
    })
    return NextResponse.json(dvd)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating DVD' }, { status: 500 })
  }
}