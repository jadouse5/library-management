"use client";

import { useState, useEffect } from "react";
import { Book as BookIcon, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Book } from "@/lib/types";
import { AddBookDialog } from "./add-book-dialog";
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="rounded-md bg-destructive/15 p-4 text-destructive">
    <p>{message}</p>
  </div>
);

export default function BooksPage() {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/books');
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load books. Please try again later.');
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addBook = async (newBook: Omit<Book, 'id'>) => {
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });
      const book = await response.json();
      setBooks([book, ...books]);
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleCheckout = async (bookId: string) => {
    try {
      const response = await fetch(`/api/books/${bookId}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          borrower: 'Current User',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to checkout book');
      }

      await fetchBooks(); // Refresh the book list
      
      toast({
        title: "Success",
        description: "Book has been checked out successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error checking out book:', error);
      toast({
        title: "Error",
        description: "Failed to check out book",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );
  
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Books Management</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border border-border bg-card shadow-lg hover:shadow-xl transition-shadow duration-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading books...
                </TableCell>
              </TableRow>
            ) : filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No books found
                </TableCell>
              </TableRow>
            ) : (
              paginatedBooks.map((book) => (
                <TableRow key={String(book.id)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 relative overflow-hidden rounded-md">
                        <Image
                          src={book.imageUrl || '/placeholder-book.jpg'}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{book.title}</span>
                        <span className="text-sm text-muted-foreground">{book.isbn}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.publishYear}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        book.isBorrowed
                          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                          : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {book.isBorrowed ? "Borrowed" : "Available"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={book.isBorrowed ? "secondary" : "default"}
                      size="sm"
                      disabled={book.isBorrowed}
                      onClick={() => handleCheckout(String(book.id))}
                    >
                      {book.isBorrowed ? "Checked Out" : "Check Out"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              isActive={currentPage !== 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              isActive={currentPage !== totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <AddBookDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={addBook}
      />

      {error && <ErrorMessage message={error} />}
    </div>
  );
}