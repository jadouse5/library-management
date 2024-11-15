import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.book.deleteMany()
  
  // Create example books
  const books = [
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "9780743273565",
      publishYear: 1925,
      isBorrowed: false
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "9780446310789",
      publishYear: 1960,
      isBorrowed: false
    },
    {
      title: "1984",
      author: "George Orwell",
      isbn: "9780451524935",
      publishYear: 1949,
      isBorrowed: false
    },
    {
      title: "Design Patterns: Elements of Reusable Object-Oriented Software",
      author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
      isbn: "9780201633610",
      publishYear: 1994,
      isBorrowed: false
    },
    {
      title: "Object-Oriented Analysis and Design with Applications",
      author: "Grady Booch",
      isbn: "9780201895513",
      publishYear: 2007,
      isBorrowed: false
    },
    {
      title: "Clean Code: A Handbook of Agile Software Craftsmanship",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      publishYear: 2008,
      isBorrowed: false
    },
    {
      title: "The Pragmatic Programmer: Your Journey To Mastery",
      author: "Andrew Hunt, David Thomas",
      isbn: "9780135957059",
      publishYear: 1999,
      isBorrowed: false
    },
    {
      title: "Head First Design Patterns",
      author: "Eric Freeman, Bert Bates, Kathy Sierra, Elisabeth Robson",
      isbn: "9780596007126",
      publishYear: 2004,
      isBorrowed: false
    }
  ]

  for (const book of books) {
    await prisma.book.create({ data: book })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
