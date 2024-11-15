import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { borrower } = await request.json()
    const bookId = params.id

    const book = await prisma.book.update({
      where: { id: bookId },
      data: { 
        isBorrowed: true,
        borrowings: {
          create: {
            borrower,
            borrowDate: new Date(),
          }
        }
      },
    })

    return NextResponse.json(book)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error checking out book' },
      { status: 500 }
    )
  }
}