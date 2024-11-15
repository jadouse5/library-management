"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type BorrowingRecord = {
  id: string;
  itemType: "Book" | "DVD";
  title: string;
  borrower: string;
  borrowDate: Date;
  returnDate: Date | null;
};

const initialHistory: BorrowingRecord[] = [
  {
    id: "1",
    itemType: "Book",
    title: "The Midnight Library",
    borrower: "John Doe",
    borrowDate: new Date(2024, 0, 15),
    returnDate: new Date(2024, 1, 1),
  },
  {
    id: "2",
    itemType: "DVD",
    title: "Dune",
    borrower: "Jane Smith",
    borrowDate: new Date(2024, 1, 1),
    returnDate: null,
  },
  {
    id: "3",
    itemType: "Book",
    title: "Project Hail Mary",
    borrower: "Alice Johnson",
    borrowDate: new Date(2024, 1, 10),
    returnDate: null,
  },
];

export default function HistoryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<BorrowingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history');
        if (!response.ok) throw new Error('Failed to fetch history');
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error('Error:', error);
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory = history.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.borrower.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate = date
      ? format(record.borrowDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      : true;

    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Borrowing History</h1>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or borrower..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Filter by date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {date && (
          <Button variant="ghost" onClick={() => setDate(undefined)}>
            Clear date
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Borrower</TableHead>
              <TableHead>Borrow Date</TableHead>
              <TableHead>Return Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.itemType}</TableCell>
                <TableCell className="font-medium">{record.title}</TableCell>
                <TableCell>{record.borrower}</TableCell>
                <TableCell>{format(record.borrowDate, "PPP")}</TableCell>
                <TableCell>
                  {record.returnDate
                    ? format(record.returnDate, "PPP")
                    : "Not returned"}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      record.returnDate
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {record.returnDate ? "Returned" : "Borrowed"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}