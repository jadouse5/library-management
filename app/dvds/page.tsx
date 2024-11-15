"use client";

import { useState, useEffect } from "react";
import { Disc, Plus, Search } from "lucide-react";
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
import { DVD } from "@/lib/types";
import { AddDVDDialog } from "./add-dvd-dialog";

const initialDVDs: DVD[] = [
  new DVD("1", "Dune", "Denis Villeneuve", 155, 2021, false),
  new DVD("2", "The French Dispatch", "Wes Anderson", 108, 2021, true),
  new DVD("3", "No Time to Die", "Cary Fukunaga", 163, 2021, false),
];

export default function DVDsPage() {
  const [dvds, setDVDs] = useState<DVD[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDVDs();
  }, []);

  const fetchDVDs = async () => {
    try {
      const response = await fetch('/api/dvds');
      if (!response.ok) {
        throw new Error('Failed to fetch DVDs');
      }
      const data = await response.json();
      setDVDs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching DVDs:', error);
      setDVDs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDVDs = dvds.filter((dvd) =>
    dvd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dvd.director.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addDVD = (newDVD: DVD) => {
    setDVDs([...dvds, newDVD]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">DVDs Management</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add DVD
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search DVDs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Director</TableHead>
              <TableHead>Duration (min)</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading DVDs...
                </TableCell>
              </TableRow>
            ) : filteredDVDs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No DVDs found
                </TableCell>
              </TableRow>
            ) : (
              filteredDVDs.map((dvd) => (
                <TableRow key={dvd.itemID}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Disc className="h-4 w-4 text-muted-foreground" />
                      <span>{dvd.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{dvd.director}</TableCell>
                  <TableCell>{dvd.duration}</TableCell>
                  <TableCell>{dvd.releaseYear}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        dvd.isBorrowed
                          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                          : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {dvd.isBorrowed ? "Borrowed" : "Available"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddDVDDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={addDVD}
      />
    </div>
  );
}