import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id

    // Update the current borrowing record
    await prisma.borrowing.updateMany({
      where: {
        bookId,
        returnDate: null,
      },
      data: {
        returnDate: new Date(),
      },
    })

    // Update the book status
    const book = await prisma.book.update({
      where: { id: bookId },
      data: { 
        isBorrowed: false,
      },
    })

    return NextResponse.json(book)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error returning book' },
      { status: 500 }
    )
  }
}