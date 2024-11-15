import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(books)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching books' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const book = await prisma.book.create({
      data: json,
    })
    return NextResponse.json(book)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating book' }, { status: 500 })
  }
}