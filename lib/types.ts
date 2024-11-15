import { Key } from "readline";

export interface Borrowable {
  isBorrowed: boolean;
  borrowedBy?: string;
  borrowedDate?: Date;
  dueDate?: Date;
}

export abstract class LibraryItem implements Borrowable {
  constructor(
    public itemID: string,
    public title: string,
    public isBorrowed: boolean = false,
    public borrowedBy?: string,
    public borrowedDate?: Date,
    public dueDate?: Date
  ) {}
}

export class Book extends LibraryItem {
  id: Key | null | undefined;
  constructor(
    itemID: string,
    title: string,
    public author: string,
    public isbn: string,
    public publishYear: number,
    public imageUrl: string = "/placeholder-book.jpg",
    isBorrowed: boolean = false
  ) {
    super(itemID, title, isBorrowed);
  }
}

export class DVD extends LibraryItem {
  constructor(
    itemID: string,
    title: string,
    public director: string,
    public duration: number,
    public releaseYear: number,
    isBorrowed: boolean = false
  ) {
    super(itemID, title, isBorrowed);
  }
}

export type LibraryItemType = Book | DVD;